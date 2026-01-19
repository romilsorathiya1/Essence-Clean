import { Suspense } from "react";
import OrderTracking from "./OrderTracking";

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Loading order tracking...</div>}>
      <OrderTracking />
    </Suspense>
  );
}
