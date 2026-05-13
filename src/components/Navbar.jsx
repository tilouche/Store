import {
  Bell,
  Search,
} from "lucide-react";

export default function Navbar({

  search,
  setSearch,

  notifications,
  showNotifications,
  setShowNotifications,
  setNotifications
}) {

  return (

    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5 mb-6">

      {/* LEFT */}
      <div>

        <h1 className="text-3xl font-black">
          Dashboard
        </h1>

        <p className="text-gray-400">
          Welcome back admin 👋
        </p>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* SEARCH */}
        <div className="bg-white flex items-center gap-3 px-4 py-3 rounded-2xl shadow-sm w-full md:w-[320px]">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="outline-none w-full bg-transparent"
          />

        </div>

        {/* NOTIFICATIONS */}
        <div className="relative">

          <button
           onClick={() => {

                setShowNotifications(
                    !showNotifications
                );

                // MARK READ
                if (!showNotifications) {

                    const updated =
                    notifications.map(
                        (n) => ({

                        ...n,
                        read: true,
                        })
                    );

                    setNotifications(
                    updated
                    );
                }
                }}
            className="relative bg-white p-4 rounded-2xl shadow-sm border"
          >

            <Bell size={22} />

            {notifications.length > 0 && (

              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">

                {
                notifications.filter(
                    (n) => !n.read
                ).length
                }

              </span>
            )}

          </button>

          {/* DROPDOWN */}
          {showNotifications && (

            <div className="absolute right-0 mt-3 w-[340px] bg-white rounded-3xl shadow-2xl border p-4 z-50">

              <h3 className="text-xl font-black mb-4">

                🔔 Notifications

              </h3>

              {/* EMPTY */}
              {notifications.length === 0 && (

                <p className="text-gray-400">

                  No notifications

                </p>
              )}

              {/* LIST */}
              <div className="space-y-3 max-h-[400px] overflow-y-auto">

                {notifications.map((n) => (

                  <div
                    key={n.id}
                    className="bg-gray-100 rounded-2xl p-4"
                  >

                    <p className="font-semibold">

                      {n.text}

                    </p>

                    <p className="text-xs text-gray-400 mt-2">

                      {n.time}

                    </p>

                  </div>
                ))}

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}