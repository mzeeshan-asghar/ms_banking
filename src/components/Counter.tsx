"use client";

import CountUp from "react-countup";

function Counter({
  amount,
  className,
}: {
  amount: number;
  className?: string;
}) {
  return <CountUp className={className} end={amount} prefix="$" decimals={2} />;
}

export default Counter;
