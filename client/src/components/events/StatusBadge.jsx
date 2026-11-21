const styles = {
  Upcoming: 'bg-[#F8F9FC] text-navy-900 border-[#173B7A]',
  Ongoing: 'bg-campus-50 text-campus-600 border-campus-500',
  Completed: 'bg-navy-50 text-navy-500 border-navy-200',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-block rounded border px-2 py-0.5 text-xs font-semibold ${styles[status] || styles.Completed}`}>
      {status}
    </span>
  );
}


