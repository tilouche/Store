import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  LogOut,
} from "lucide-react";

export default function Sidebar({
  activePage,
  setActivePage,
  handleLogout,
}) {

  const menus = [
    {
      id: "orders",
      label: "Orders",
      icon: <LayoutDashboard size={20} />,
    },

    {
      id: "products",
      label: "Products",
      icon: <ShoppingBag size={20} />,
    },

    {
      id: "users",
      label: "Users",
      icon: <Users size={20} />,
    },
  ];

  return (

    <div className="w-full md:w-64 bg-white border-r min-h-screen p-6">

      {/* LOGO */}
      <div className="mb-10">

        <h1 className="text-3xl font-black">
          🛍 Admin
        </h1>

        <p className="text-gray-400 text-sm">
          Dashboard panel
        </p>

      </div>

      {/* MENU */}
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible">
        {menus.map((menu) => (

          <button
            key={menu.id}
            onClick={() =>
              setActivePage(menu.id)
            }
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition font-semibold
              
              ${
                activePage === menu.id
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }
            `}
          >

            {menu.icon}

            {menu.label}

          </button>
        ))}
      </div>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="mt-10 flex items-center gap-3 text-red-500 hover:text-red-700"
      >

        <LogOut size={20} />

        Logout

      </button>

    </div>
  );
}