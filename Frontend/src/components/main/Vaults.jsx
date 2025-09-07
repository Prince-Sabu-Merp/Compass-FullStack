import React from "react";
import AccountCard from "../cards/AccountCard";
import TransactionGridCard from "../cards/TransactionRecordsCard";

function Vaults(props) {
  return (
    <div className=" border-blue-300  w-full">
      {/* <!-- cards --> */}
      <div className="flex w-full justify-evenly items-center flex-wrap gap-4 p-4 ">
        <AccountCard
          CardNumber={0}
          AccountName="Federal Bank"
          AccountHolderName="PRINCE SABU"
          AccountType="Spending"
          Balance="10000"
          CurrencySymbol="₹"
          AccountLogo="https://zpigsospjvkynuwoctvh.supabase.co/storage/v1/object/sign/icons/federal-bank.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNDAxOThkNC05ZDkyLTRhNGItOTNkZC0zNTY0MWI1OWNiOGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpY29ucy9mZWRlcmFsLWJhbmsucG5nIiwiaWF0IjoxNzU0NDA5NjQ2LCJleHAiOjIwNjk3Njk2NDZ9.cEluvxxCz6YjG_BDVXCXwLVyxBSqThY-AzrI7ORSoMg"
        />
        <AccountCard
          CardNumber={4}
          AccountName="Bank of Baroda"
          AccountHolderName="PRINCE SABU"
          AccountType="Emergency"
          Balance="20000"
          CurrencySymbol="₹"
          AccountLogo="https://zpigsospjvkynuwoctvh.supabase.co/storage/v1/object/sign/icons/bob.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNDAxOThkNC05ZDkyLTRhNGItOTNkZC0zNTY0MWI1OWNiOGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpY29ucy9ib2IuanBnIiwiaWF0IjoxNzU0NDA5NjcyLCJleHAiOjIwNjk3Njk2NzJ9.lgYU28nrEZWV9lTqCVyloB9G7UkqQGq0sN-Cye20c_Y"
        />

        <AccountCard
          CardNumber={3}
          AccountName="Dhanlexmi Bank"
          AccountHolderName="PRINCE SABU"
          AccountType="Savings"
          Balance="30000"
          CurrencySymbol="₹"
          AccountLogo="https://zpigsospjvkynuwoctvh.supabase.co/storage/v1/object/sign/icons/dhanlaxmi-bank.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNDAxOThkNC05ZDkyLTRhNGItOTNkZC0zNTY0MWI1OWNiOGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpY29ucy9kaGFubGF4bWktYmFuay5wbmciLCJpYXQiOjE3NTQ0MDk2OTQsImV4cCI6MjA2OTc2OTY5NH0.yAVds8dxgJtO89yDOzj-u_ji21aPYdk6WCf4rJUPHpU"
        />
        <AccountCard
          CardNumber={2}
          AccountName="Indian Post Payments Bank"
          AccountHolderName="PRINCE SABU"
          AccountType="Savings"
          Balance="40000"
          CurrencySymbol="₹"
          AccountLogo="https://zpigsospjvkynuwoctvh.supabase.co/storage/v1/object/sign/icons/India-Post-Payments-Bank-Color.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNDAxOThkNC05ZDkyLTRhNGItOTNkZC0zNTY0MWI1OWNiOGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpY29ucy9JbmRpYS1Qb3N0LVBheW1lbnRzLUJhbmstQ29sb3IucG5nIiwiaWF0IjoxNzU0NDEwMDIyLCJleHAiOjIwNjk3NzAwMjJ9.vRSezX8oXNAMAUmLY8F3CKh1XI5Kc_H-MSvufVBhqbM"
        />
      </div>

      <div className="p-4">
        <TransactionGridCard />
      </div>
    </div>
  );
}

export default Vaults;
