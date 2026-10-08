import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ArrowUp, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { checkoutCart, verifyCart } from "@/api/payment";
import {
  selectCartItems,
  selectCartTotal,
  clearCart,
} from "@/store/slices/cartSlice";
import { selectCurrentUser } from "@/store/slices/authSlice";
import type { RootState, AppDispatch } from "@/store";
import type { Address } from "@/types";

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => Promise<void>;
  modal?: {
    ondismiss?: () => void;
  };
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

function isAddressComplete(address?: Address | null): address is Address {
  if (!address) return false;
  return Boolean(
    address.line1?.trim() &&
    address.city?.trim() &&
    address.postalCode?.trim() &&
    address.phone?.trim(),
  );
}

export function CheckoutPage() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => selectCartItems(state));
  const total = useSelector((state: RootState) => selectCartTotal(state));
  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);
  const [checkoutState, setCheckoutState] = useState<
    "idle" | "success" | "partial" | "failure" | "verifyError"
  >("idle");
  const [fulfilled, setFulfilled] = useState<string[]>([]);
  const [failed, setFailed] = useState<
    { productName: string; reason: string }[]
  >([]);
  const [paymentId, setPaymentId] = useState<string>("");

  const hasCompleteAddress = isAddressComplete(user?.address);

  const handlePayNow = async () => {
    if (items.length === 0) return;

    if (!user?.address || !isAddressComplete(user.address)) {
      toast.error(
        "Shipping address is incomplete. Please add a valid address in your account.",
      );
      return;
    }

    if (!isAddressConfirmed) {
      toast.error("Please confirm your shipping address before proceeding.");
      return;
    }

    setIsProcessing(true);
    try {
      const checkoutRes = await checkoutCart(user.address);
      const { razorpayOrderId, amount, currency, keyId } = checkoutRes.data;

      const options: RazorpayOptions = {
        key: keyId,
        amount,
        currency,
        name: "Vintage Thrift Room",
        order_id: razorpayOrderId,
        handler: async (response: RazorpaySuccessResponse) => {
          // response contains razorpay_payment_id, razorpay_order_id, razorpay_signature
          setPaymentId(response.razorpay_payment_id);
          try {
            const verifyRes = await verifyCart({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            const { fulfilled: okItems, failed: badItems } = verifyRes.data;
            if (badItems.length === 0) {
              dispatch(clearCart());
              setCheckoutState("success");
              setFulfilled(okItems);
            } else if (okItems.length > 0) {
              setCheckoutState("partial");
              setFulfilled(okItems);
              setFailed(badItems);
            } else {
              setCheckoutState("failure");
              setFailed(badItems);
            }
          } catch {
            // network failure during verification
            setCheckoutState("verifyError");
            toast.error(
              "Verification failed – payment may have been processed. Please contact support.",
            );
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.address?.phone || user?.phone,
        },
        theme: {
          color: "#6B4A38",
        },
      };

      if (!window.Razorpay) {
        toast.error(
          "Payment gateway is loading. Please try again in a moment.",
        );
        setIsProcessing(false);
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      setIsProcessing(false);
      const errorObj = err as {
        response?: { status?: number; data?: { message?: string } };
        message?: string;
      };
      const status = errorObj?.response?.status;
      const message = errorObj?.response?.data?.message || errorObj.message;
      if (status === 400 || status === 409) {
        toast.error(message || "A conflict occurred during checkout.");
      } else {
        toast.error("An unexpected error occurred while initiating checkout.");
      }
    }
  };

  if (items.length === 0 && checkoutState === "idle") {
    return (
      <div className="py-20 text-center">
        <h2 className="font-serif text-2xl font-medium text-foreground">
          Your shopping bag is empty
        </h2>
        <Link to="/shop" className="mt-4 inline-block">
          <Button variant="primary" size="md">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  const renderSummary = () => (
    <div className="border border-border bg-surface p-6 rounded-sm h-fit space-y-4">
      <h2 className="font-serif text-xl font-medium text-foreground border-b border-border pb-4">
        Order Summary
      </h2>
      {/* Reminder to check address info */}
      <div className="rounded-sm border border-border/80 bg-background p-3 text-xs font-sans text-secondary leading-relaxed">
        <span className="font-semibold text-foreground block mb-0.5">
          Review Delivery Info:
        </span>
        Please check your address and phone number carefully to ensure seamless
        7-day delivery.
      </div>

      <div className="space-y-3 py-4 text-sm font-sans">
        <div className="flex justify-between text-secondary">
          <span>Subtotal</span>
          <span className="text-foreground font-medium">₹{total}</span>
        </div>
        <div className="flex justify-between text-secondary">
          <span>Shipping</span>
          <span>₹{total >= 75 ? "Free" : "8.00"}</span>
        </div>
        <div className="border-t border-border pt-3 flex justify-between text-base font-semibold text-foreground">
          <span>Estimated Total</span>
          <span>₹{total >= 75 ? total : total + 8}</span>
        </div>
      </div>
      <Button
        onClick={handlePayNow}
        variant="primary"
        size="lg"
        fullWidth
        loading={isProcessing}
        disabled={!isAddressConfirmed || isProcessing}
        className="mt-4"
      >
        Pay Now
      </Button>
      {!isAddressConfirmed && (
        <div className="flex items-center justify-center gap-1.5 text-xs text-secondary text-center animate-pulse">
          <ArrowUp size={14} className="text-primary shrink-0" />
          <span>Please confirm your shipping address above to proceed</span>
        </div>
      )}
    </div>
  );

  const renderSuccess = () => (
    <div className="p-6 bg-[var(--color-accent)] text-[var(--color-foreground)] rounded-sm">
      <h2 className="font-serif text-2xl font-medium mb-4">
        Payment Successful!
      </h2>
      <p className="mb-2">Your order has been placed.</p>
      {fulfilled.length > 0 && (
        <ul className="list-disc list-inside mb-4">
          {fulfilled.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      )}
      <Link to="/shop">
        <Button variant="secondary" size="md">
          Continue Shopping
        </Button>
      </Link>
    </div>
  );

  const renderPartial = () => (
    <div className="p-6 bg-[var(--color-accent)] text-[var(--color-foreground)] rounded-sm mb-4">
      <h2 className="font-serif text-lg font-medium mb-2">Partial Success</h2>
      <p className="mb-2">
        Some items could not be purchased due to stock issues.
      </p>
      <div className="mb-2">
        <strong>Fulfilled:</strong>
        <ul className="list-disc list-inside">
          {fulfilled.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
      <div className="mb-2">
        <strong>Failed:</strong>
        <ul className="list-disc list-inside">
          {failed.map((f) => (
            <li key={f.productName}>
              {f.productName}: {f.reason}
            </li>
          ))}
        </ul>
      </div>
      <p>Please contact support for the failed items.</p>
      <Link to="/shop" className="mt-2 inline-block">
        <Button variant="secondary" size="md">
          Continue Shopping
        </Button>
      </Link>
    </div>
  );

  const renderFailure = () => (
    <div className="p-6 bg-[var(--color-destructive)] text-white rounded-sm mb-4">
      <h2 className="font-serif text-lg font-medium mb-2">Payment Failed</h2>
      <p className="mb-2">All items could not be purchased.</p>
      {failed.map((f) => (
        <p key={f.productName}>
          {f.productName}: {f.reason}
        </p>
      ))}
      <Link to="/shop" className="mt-2 inline-block">
        <Button variant="secondary" size="md">
          Continue Shopping
        </Button>
      </Link>
    </div>
  );

  const renderVerifyError = () => (
    <div className="p-6 bg-[var(--color-destructive)] text-white rounded-sm mb-4">
      <h2 className="font-serif text-lg font-medium mb-2">
        Verification Error
      </h2>
      <p className="mb-2">
        We could not verify your payment. It may have succeeded.
      </p>
      {paymentId && <p>Razorpay Payment ID: {paymentId}</p>}
      <p>
        Please contact support via the{" "}
        <Link to="/contact" className="underline">
          Contact
        </Link>{" "}
        page.
      </p>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-medium text-foreground mb-6">
        Checkout
      </h1>
      {checkoutState === "success" && renderSuccess()}
      {checkoutState === "partial" && renderPartial()}
      {checkoutState === "failure" && renderFailure()}
      {checkoutState === "verifyError" && renderVerifyError()}
      {checkoutState === "idle" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Shipping Address */}
            {!hasCompleteAddress ? (
              <div className="border border-border bg-surface p-6 rounded-sm">
                <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
                  <MapPin size={18} className="text-primary" />
                  <h2 className="font-serif text-lg font-medium text-foreground">
                    Shipping Address
                  </h2>
                </div>
                <p className="font-sans text-sm text-secondary mb-4">
                  Please add a shipping address to continue.
                </p>
                <Button as={Link} to="/account" variant="primary" size="md">
                  Add Shipping Address
                </Button>
              </div>
            ) : (
              <div className="border border-border bg-surface p-6 rounded-sm">
                <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-primary" />
                    <h2 className="font-serif text-lg font-medium text-foreground">
                      Shipping Address
                    </h2>
                  </div>
                  <Link
                    to="/account"
                    className="font-sans text-xs font-semibold uppercase tracking-wider text-primary hover:text-foreground transition-colors"
                  >
                    Edit
                  </Link>
                </div>
                <div className="space-y-1 font-sans text-sm text-secondary">
                  <p className="font-medium text-foreground">{user?.name}</p>
                  <p>{user?.address?.line1}</p>
                  {user?.address?.line2 && <p>{user?.address?.line2}</p>}
                  <p>
                    {user?.address?.city}
                    {user?.address?.state
                      ? `, ${user?.address?.state}`
                      : ""}{" "}
                    {user?.address?.postalCode}
                  </p>
                  {user?.address?.country && <p>{user?.address?.country}</p>}
                  <p className="pt-1 text-xs text-secondary/80">
                    Phone: {user?.address?.phone}
                  </p>
                </div>
                <label className="mt-4 pt-4 border-t border-border flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAddressConfirmed}
                    onChange={(e) => setIsAddressConfirmed(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
                  />
                  <span className="font-sans text-sm font-medium text-foreground">
                    Ship to this address
                  </span>
                </label>
              </div>
            )}

            {/* Step 2: Review Items */}
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-medium text-foreground">
                Review Items (
                {items.reduce((acc, item) => acc + item.quantity, 0)})
              </h2>
              {items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex flex-col sm:flex-row gap-4 p-4 border border-border bg-surface rounded-sm"
                >
                  <Link
                    to={`/product/${item.product._id}`}
                    className="w-full sm:w-28 aspect-[3/4] sm:aspect-auto sm:h-36 overflow-hidden rounded-sm bg-muted shrink-0"
                  >
                    <img
                      src={item.product.image?.[0]?.url}
                      alt={item.product.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </Link>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link to={`/product/${item.product._id}`}>
                          <h3 className="font-sans text-sm font-semibold text-foreground hover:text-primary transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-primary font-medium mt-1">
                          ₹{item.product.price} each
                        </p>
                      </div>
                      <span className="text-xs text-secondary">
                        Qty: {item.quantity}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-border/60">
                      <span className="font-sans text-sm font-semibold text-foreground">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary & Pay Now — ONLY shown when complete address exists */}
          {hasCompleteAddress && renderSummary()}
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;
