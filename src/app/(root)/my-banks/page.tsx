import BankCard from "@/components/BankCard";
import HeaderBox from "@/components/HeaderBox";
import { getMultipleAccounts } from "@/lib/actions/bank.actions";
import { getCurrentUser } from "@/lib/actions/user.actions";

const MyBanks = async () => {
  const currentUser = await getCurrentUser();

  const accounts = await getMultipleAccounts({
    userId: currentUser.$id,
  });

  if (!accounts) return;

  return (
    <section className="flex">
      <div className="my-banks">
        <HeaderBox
          title="My Bank Accounts"
          subtext="Effortlessly manage your banking activites."
        />

        <div className="space-y-4">
          <h2 className="header-2">Your cards</h2>
          <div className="flex flex-wrap gap-6">
            {accounts &&
              accounts.data.map((a: AccountProps) => (
                <BankCard
                  key={accounts.id}
                  account={a}
                  userName={currentUser?.firstName}
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyBanks;
