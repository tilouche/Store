import {
  ShoppingBag,
  Package,
  DollarSign,
  Users,
} from "lucide-react";

export default function StatsCard({
  orders,
  products,
}) {

  // ============================
  // TOTALS
  // ============================

  const revenue =
    orders.reduce(
      (acc, order) =>
        acc + order.total,
      0
    );

  const totalOrders =
    orders.length;

  const totalProducts =
    products.length;

  const clients =
    new Set(
      orders.map(
        (o) => o.phone
      )
    ).size;

  // ============================
  // DATA
  // ============================

  const stats = [

    {
      title: "Revenue",
      value: `${revenue} DT`,
      icon: DollarSign,
    },

    {
      title: "Orders",
      value: totalOrders,
      icon: ShoppingBag,
    },

    {
      title: "Products",
      value: totalProducts,
      icon: Package,
    },

    {
      title: "Clients",
      value: clients,
      icon: Users,
    },
  ];

  // ============================
  // UI
  // ============================

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

      {stats.map(
        (stat, index) => {

          const Icon =
            stat.icon;

          return (

            <div
              key={index}
              className="bg-white rounded-3xl p-6 shadow-sm border"
            >

              <div className="flex justify-between items-start">

                <div>

                  <p className="text-gray-400 font-medium">
                    {stat.title}
                  </p>

                  <h2 className="text-4xl font-black mt-4">
                    {stat.value}
                  </h2>

                </div>

                <div className="bg-black text-white p-4 rounded-2xl">

                  <Icon size={28} />

                </div>

              </div>

            </div>
          );
        }
      )}

    </div>
  );
}