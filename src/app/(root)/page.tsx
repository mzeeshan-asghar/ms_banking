/* eslint-disable @typescript-eslint/no-unused-vars */
import HeaderBox from "@/components/HeaderBox";
import RecentTransactions from "@/components/RecentTransactions";
import RightSidebar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import {
  getMultipleAccounts,
  getSingleAccount,
} from "@/lib/actions/bank.actions";
import { getCurrentUser } from "@/lib/actions/user.actions";

const Home = async ({ searchParams }: ParamsProps) => {
  const { id, page } = await searchParams;
  const currentUser = await getCurrentUser();
  const accounts = await getMultipleAccounts({
    userId: currentUser.$id,
  });

  if (!accounts) return;

  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  const account = await getSingleAccount({ appwriteItemId });

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
            accounts={accountsData}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          />
        </header>

        <RecentTransactions
          accounts={accountsData}
          transactions={account?.transactions}
          appwriteItemId={appwriteItemId}
          page={Number(page as string) || 1}
        />
      </div>

      <RightSidebar
        user={currentUser}
        transactions={account?.transactions}
        banks={accountsData?.slice(0, 2)}
      />
    </section>
  );
};

export default Home;
