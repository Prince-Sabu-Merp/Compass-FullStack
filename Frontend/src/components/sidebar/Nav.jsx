import React, { useState } from "react";
import NavItems from "./NavItems";
import Profile from "./profile";

const NAV_ITEMS = [
  {
    title: "Hub",
    icon: "https://zpigsospjvkynuwoctvh.supabase.co/storage/v1/object/sign/icons/home_outline_icon.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNDAxOThkNC05ZDkyLTRhNGItOTNkZC0zNTY0MWI1OWNiOGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpY29ucy9ob21lX291dGxpbmVfaWNvbi5wbmciLCJpYXQiOjE3NTQ0MDE5MjgsImV4cCI6MjA2OTc2MTkyOH0.dlWPI-SvWzwWL0Blc2Mn7c7sDGXx-KJ40l_Wj7VN1UI",
    mobile: true,
    desktop: true,
    selectedIcon:
      "https://zpigsospjvkynuwoctvh.supabase.co/storage/v1/object/sign/icons/home_filled_icon.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNDAxOThkNC05ZDkyLTRhNGItOTNkZC0zNTY0MWI1OWNiOGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpY29ucy9ob21lX2ZpbGxlZF9pY29uLnBuZyIsImlhdCI6MTc1NDQwMTg3OSwiZXhwIjoyMDY5NzYxODc5fQ.Elpd4dVG5K2bjAznN9DQZyQn-I_62YhMlaBL6MugUn4",
  },
  {
    title: "Ledger",
    icon: "https://zpigsospjvkynuwoctvh.supabase.co/storage/v1/object/sign/icons/transaction_outline_icon.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNDAxOThkNC05ZDkyLTRhNGItOTNkZC0zNTY0MWI1OWNiOGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpY29ucy90cmFuc2FjdGlvbl9vdXRsaW5lX2ljb24ucG5nIiwiaWF0IjoxNzUzODcxNTAyLCJleHAiOjIwNjkyMzE1MDJ9._EJa219UOiL1dTpesEenm_5f6F-XYil5Qdk0cU4RNas",
    mobile: true,
    desktop: true,
    selectedIcon:
      "https://zpigsospjvkynuwoctvh.supabase.co/storage/v1/object/sign/icons/transaction_filled_icon.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNDAxOThkNC05ZDkyLTRhNGItOTNkZC0zNTY0MWI1OWNiOGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpY29ucy90cmFuc2FjdGlvbl9maWxsZWRfaWNvbi5wbmciLCJpYXQiOjE3NTQ0MDIyNDksImV4cCI6MjA2OTc2MjI0OX0.XrdOK-PhnJ5ooktsg9GcXUH1fQB7Tn7awCBL24iAF8E",
  },
  {
    title: "Planner",
    icon: "https://zpigsospjvkynuwoctvh.supabase.co/storage/v1/object/sign/icons/budget_outline_icon.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNDAxOThkNC05ZDkyLTRhNGItOTNkZC0zNTY0MWI1OWNiOGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpY29ucy9idWRnZXRfb3V0bGluZV9pY29uLnBuZyIsImlhdCI6MTc1Mzg3MTU0NSwiZXhwIjoyMDY5MjMxNTQ1fQ.UG3CRpPDa1kiKr4ujPJVXIBf9wjXt8Xd7GA0LOycMvE",
    mobile: true,
    desktop: true,
    selectedIcon:
      "https://zpigsospjvkynuwoctvh.supabase.co/storage/v1/object/sign/icons/budget_filled_icon.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNDAxOThkNC05ZDkyLTRhNGItOTNkZC0zNTY0MWI1OWNiOGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpY29ucy9idWRnZXRfZmlsbGVkX2ljb24ucG5nIiwiaWF0IjoxNzU0NDAyMjk3LCJleHAiOjIwNjk3NjIyOTd9.yYETX1KO8Zdp4ZZs1eYDsGTDQiiaxf5FTjxbC-RCmSY",
  },
  {
    title: "Vaults",
    icon: "https://zpigsospjvkynuwoctvh.supabase.co/storage/v1/object/sign/icons/accounts_outline_icon.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNDAxOThkNC05ZDkyLTRhNGItOTNkZC0zNTY0MWI1OWNiOGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpY29ucy9hY2NvdW50c19vdXRsaW5lX2ljb24ucG5nIiwiaWF0IjoxNzUzODcxNzA3LCJleHAiOjIwNjkyMzE3MDd9.DcsT7ZBek8ij9xQ_vWtZx0c9t14AVaRbiPtg5n95V_M",
    mobile: true,
    desktop: true,
    selectedIcon:
      "https://zpigsospjvkynuwoctvh.supabase.co/storage/v1/object/sign/icons/accounts_filled_icon.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNDAxOThkNC05ZDkyLTRhNGItOTNkZC0zNTY0MWI1OWNiOGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpY29ucy9hY2NvdW50c19maWxsZWRfaWNvbi5wbmciLCJpYXQiOjE3NTQ0MDIzMjUsImV4cCI6MjA2OTc2MjMyNX0.pBxWJ7HgyEf2coPF9J09mIrTvbbvfexhmFduR8h6S3Y",
  },
  {
    title: "More",
    icon: "https://zpigsospjvkynuwoctvh.supabase.co/storage/v1/object/sign/icons/more_outline_icon.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNDAxOThkNC05ZDkyLTRhNGItOTNkZC0zNTY0MWI1OWNiOGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpY29ucy9tb3JlX291dGxpbmVfaWNvbi5wbmciLCJpYXQiOjE3NTM4NzE4MTIsImV4cCI6MjA2OTIzMTgxMn0.HD7xxow8EplIzJsEBzeqhUd55WccfB9McRtVHxrdvaE",
    mobile: true,
    desktop: false,
    selectedIcon:
      "https://zpigsospjvkynuwoctvh.supabase.co/storage/v1/object/sign/icons/more_filled_icon.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNDAxOThkNC05ZDkyLTRhNGItOTNkZC0zNTY0MWI1OWNiOGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpY29ucy9tb3JlX2ZpbGxlZF9pY29uLnBuZyIsImlhdCI6MTc1NDQwMjM1MywiZXhwIjoyMDY5NzYyMzUzfQ.7e_AKN1uwWNoRk7hnlP7Wp_7d_nPOzSG-6vy4Y5ylec",
  },
  {
    title: "Portfolio",
    icon: "https://zpigsospjvkynuwoctvh.supabase.co/storage/v1/object/sign/icons/investments_outline_icon.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNDAxOThkNC05ZDkyLTRhNGItOTNkZC0zNTY0MWI1OWNiOGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpY29ucy9pbnZlc3RtZW50c19vdXRsaW5lX2ljb24ucG5nIiwiaWF0IjoxNzUzODczMDM4LCJleHAiOjIwNjkyMzMwMzh9.2iKD01hycl1eXwc4_Xx7eNaxkEN4atUcnfwyG191-oE",
    mobile: false,
    desktop: true,
    selectedIcon:
      "https://zpigsospjvkynuwoctvh.supabase.co/storage/v1/object/sign/icons/investments_filled_icon.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNDAxOThkNC05ZDkyLTRhNGItOTNkZC0zNTY0MWI1OWNiOGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpY29ucy9pbnZlc3RtZW50c19maWxsZWRfaWNvbi5wbmciLCJpYXQiOjE3NTQ0MDIzODIsImV4cCI6MjA2OTc2MjM4Mn0.O24u6W8LNPUvQoEyXDIRiH_gn68x5I8bWZPKBfFx9o4",
  },
  {
    title: "Goal",
    icon: "https://zpigsospjvkynuwoctvh.supabase.co/storage/v1/object/sign/icons/goal_outline_icon.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNDAxOThkNC05ZDkyLTRhNGItOTNkZC0zNTY0MWI1OWNiOGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpY29ucy9nb2FsX291dGxpbmVfaWNvbi5wbmciLCJpYXQiOjE3NTM4NzMyNTUsImV4cCI6MjA2OTIzMzI1NX0.hYImWPW1vUqSWvqLhzYLWCqzu7d2PZq1L8Tf5Bd5ae0",
    mobile: false,
    desktop: true,
    selectedIcon:
      "https://zpigsospjvkynuwoctvh.supabase.co/storage/v1/object/sign/icons/goal_filled_icon.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNDAxOThkNC05ZDkyLTRhNGItOTNkZC0zNTY0MWI1OWNiOGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpY29ucy9nb2FsX2ZpbGxlZF9pY29uLnBuZyIsImlhdCI6MTc1NDQwMjQwNywiZXhwIjoyMDY5NzYyNDA3fQ.qqPhVzW1e2Ia0V9IpTlNPs1hA2XqUs8euoV-zoD9Cx8",
  },
  {
    title: "Dues",
    icon: "https://zpigsospjvkynuwoctvh.supabase.co/storage/v1/object/sign/icons/debt_outline_icon.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNDAxOThkNC05ZDkyLTRhNGItOTNkZC0zNTY0MWI1OWNiOGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpY29ucy9kZWJ0X291dGxpbmVfaWNvbi5wbmciLCJpYXQiOjE3NTM4NzQzMzIsImV4cCI6MjA2OTIzNDMzMn0.gWay21vdbFHe7f9rH00MJTti_9WuA19hhC6jNAXZcXg",
    mobile: false,
    desktop: true,
    selectedIcon:
      "https://zpigsospjvkynuwoctvh.supabase.co/storage/v1/object/sign/icons/debt_filled_icon.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNDAxOThkNC05ZDkyLTRhNGItOTNkZC0zNTY0MWI1OWNiOGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpY29ucy9kZWJ0X2ZpbGxlZF9pY29uLnBuZyIsImlhdCI6MTc1NDQwMjQzNSwiZXhwIjoyMDY5NzYyNDM1fQ.4TYS1DF_T7Db-9vXNvVx0Y762SCZo3j0dJziIp1Yrr4",
  },
  {
    title: "Tune Up",
    icon: "https://zpigsospjvkynuwoctvh.supabase.co/storage/v1/object/sign/icons/settings_outline_icon.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNDAxOThkNC05ZDkyLTRhNGItOTNkZC0zNTY0MWI1OWNiOGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpY29ucy9zZXR0aW5nc19vdXRsaW5lX2ljb24ucG5nIiwiaWF0IjoxNzUzODc0NDIzLCJleHAiOjIwNjkyMzQ0MjN9.BkiHO6u9-rnUV6_dDEPkVkzB_n6NXwNB-K736YuTFBY",
    mobile: false,
    desktop: true,
    selectedIcon:
      "https://zpigsospjvkynuwoctvh.supabase.co/storage/v1/object/sign/icons/settings_filled_icon.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNDAxOThkNC05ZDkyLTRhNGItOTNkZC0zNTY0MWI1OWNiOGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpY29ucy9zZXR0aW5nc19maWxsZWRfaWNvbi5wbmciLCJpYXQiOjE3NTQ0MDI2MDQsImV4cCI6MjA2OTc2MjYwNH0.sSrIocDIk-xq8iqFMIod-l6x5rOCLiMaZcePNA1d0so",
  },
];

function Nav({ className = "", onItemClick }) {
  const [selectedItem, setSelectedItem] = useState("Hub");

  const handleItemClick = (title) => {
    setSelectedItem(title);
    if (onItemClick) {
      onItemClick(title);
    }
  };

  const mobileNavItems = NAV_ITEMS.filter((item) => item.mobile);
  const desktopNavItems = NAV_ITEMS.filter((item) => item.desktop);

  return (
    <>
      <div className="flex flex-col justify-between h-full w-full md:overflow-x-scroll">
        {/* Mobile Navigation */}
        <div
          className={`p-1.5 flex md:hidden flex-row items-center justify-around ${className}`}
        >
          {mobileNavItems.map((item) => (
            <NavItems
              key={item.title}
              title={item.title}
              // Use a conditional check to determine which icon to display
              icon={selectedItem === item.title ? item.selectedIcon : item.icon}
              id={item.title}
              onClick={() => handleItemClick(item.title)}
              isSelected={selectedItem === item.title}
            />
          ))}
        </div>

        {/* Desktop Navigation */}
        <div
          className={`p-1.5 hidden md:flex flex-col md:h-auto items-center justify-around md:pt-3 ${className}`}
        >
          {desktopNavItems.map((item) => (
            <NavItems
              key={item.title}
              title={item.title}
              // Use a conditional check to determine which icon to display
              icon={selectedItem === item.title ? item.selectedIcon : item.icon}
              id={item.title}
              onClick={() => handleItemClick(item.title)}
              isSelected={selectedItem === item.title}
            />
          ))}
        </div>

        <div className="relative">
          <Profile
            name={"Prince Sabu"}
            img={
              "https://zpigsospjvkynuwoctvh.supabase.co/storage/v1/object/sign/profile/Prince_sabu_Photo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNDAxOThkNC05ZDkyLTRhNGItOTNkZC0zNTY0MWI1OWNiOGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwcm9maWxlL1ByaW5jZV9zYWJ1X1Bob3RvLnBuZyIsImlhdCI6MTc1Mzk1NzAzNCwiZXhwIjoyMDY5MzE3MDM0fQ.NaE-PtZ09wfSmCrWl1zkDSLP_LCUSzdJ6nxL-b8lFcU"
            }
          />
        </div>
      </div>
    </>
  );
}

export default Nav;
