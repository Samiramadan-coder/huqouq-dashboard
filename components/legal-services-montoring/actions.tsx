import Checkin from "./checkin";
import CancelRefund from "./cancel-refund";
import ExtendDeadline from "./extend-deadline";
import ExtendReview from "./extend-review";
import ApproveOnBehalf from "./approve-on-behalf";
import { LegalServiceDetails } from "@/types/legal-services-montoring";

export default function Actions({
  service,
  onChanged,
}: {
  service: LegalServiceDetails;
  onChanged: () => void;
}) {
  const {
    checkin,
    cancel_refund: cancelRefund,
    extend_deadline: extendDeadline,
    extend_review: extendReview,
    approve_on_behalf: approveOnBehalf,
  } = service.actions;

  return (
    <div className="flex flex-wrap gap-2">
      <ExtendDeadline
        service={service}
        disabled={!extendDeadline.available}
        title={extendDeadline.available ? undefined : extendDeadline.reason}
        onSuccess={onChanged}
      />

      <Checkin
        service={service}
        disabled={!checkin.available}
        title={checkin.available ? undefined : checkin.reason}
        onSuccess={onChanged}
      />

      <ExtendReview
        service={service}
        disabled={!extendReview.available}
        title={extendReview.available ? undefined : extendReview.reason}
        onSuccess={onChanged}
      />

      <ApproveOnBehalf
        service={service}
        disabled={!approveOnBehalf.available}
        title={approveOnBehalf.available ? undefined : approveOnBehalf.reason}
        onSuccess={onChanged}
      />

      <CancelRefund
        service={service}
        disabled={!cancelRefund.available}
        title={cancelRefund.available ? undefined : cancelRefund.reason}
        onSuccess={onChanged}
      />
    </div>
  );
}
