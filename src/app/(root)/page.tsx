/* eslint-disable @typescript-eslint/no-unused-vars */
import HeaderBox from "@/components/HeaderBox";
import RightSidebar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import { getCurrentUser } from "@/lib/actions/user.actions";

const Home = async ({ searchParams }: ParamsProps) => {
  const params = await searchParams;
  const currentPage = 1;
  const currentUser = await getCurrentUser();

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

      <RightSidebar user={currentUser} transactions={[]} banks={[]} />
    </section>
  );
};

export default Home;
