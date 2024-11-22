import Counter from "@/components/Counter";
import DoughnutChart from "@/components/DoughnutChart";

function TotalBalanceBox({
  accounts,
  totalBanks,
  totalCurrentBalance,
}: TotalBalanceBoxProps) {
  return (
    <section className="total-balance">
      <div className="total-balance-chart">
        <DoughnutChart accounts={accounts} />
      </div>
      <div className="flex flex-col gap-6">
        <h2 className="header-2">Bank Accounts: {totalBanks}</h2>
        <div className="flex flex-col gap-2">
          <span className="total-balance-label">Total Current Balance</span>
          <Counter
            className="total-balance-amount"
            amount={totalCurrentBalance}
          />
        </div>
      </div>
    </section>
  );
}

export default TotalBalanceBox;
