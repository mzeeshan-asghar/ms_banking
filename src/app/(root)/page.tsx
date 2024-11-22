/* eslint-disable @typescript-eslint/no-unused-vars */
import HeaderBox from "@/components/HeaderBox";
import RightSidebar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  const currentUser = { firstName: "Zeeshan", lastName: "Asghar" };

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={currentUser?.firstName || "Guest"}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceBox
            accounts={[]}
            totalBanks={11}
            totalCurrentBalance={1200.34}
          />
        </header>

        {/* <RecentTransactions
          accounts={accountsData}
          transactions={account?.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        /> */}
      </div>

      <RightSidebar
        user={currentUser}
        transactions={[]}
        banks={[{ currentBalance: 112.33 }, { currentBalance: 888.22 }]}
      />
    </section>
  );
};

export default Home;
