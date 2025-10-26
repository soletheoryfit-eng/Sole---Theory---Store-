export default function FAQ() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold">FAQ</h1>
      <div className="mt-6 space-y-4 text-neutral-700">
        <div>
          <p className="font-semibold">How do I order?</p>
          <p>Tap “Order on WhatsApp” on any product. We’ll confirm your order and share delivery time and shipping cost.</p>
        </div>
        <div>
          <p className="font-semibold">What currency?</p>
          <p>All prices are shown in RON (Lei).</p>
        </div>
        <div>
          <p className="font-semibold">Do you deliver outside Romania?</p>
          <p>We ship from the U.S. and China. International options are expanding — message us for details.</p>
        </div>
        <div>
          <p className="font-semibold">Returns?</p>
          <p>7 days from delivery if unused and in original condition. Please record an unboxing video.</p>
        </div>
        <div>
          <p className="font-semibold">Payment?</p>
          <p>Payment is completed only after your order is confirmed by us.</p>
        </div>
      </div>
    </div>
  );
}
