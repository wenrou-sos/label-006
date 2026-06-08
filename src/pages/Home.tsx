import { Monitor, Touchpad, UserCog, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const cards = [
  {
    title: "取号终端",
    description: "触摸屏取号页面，市民自助选择业务类型取号",
    to: "/ticket",
    icon: Touchpad,
    color: "from-blue-600 to-blue-800",
  },
  {
    title: "排队大屏",
    description: "大厅展示大屏，实时显示各窗口叫号状态",
    to: "/display",
    icon: Monitor,
    color: "from-slate-700 to-slate-900",
  },
  {
    title: "窗口呼叫",
    description: "工作人员操作端，呼叫下一位、重复呼叫、办理完成",
    to: "/counter/1",
    icon: UserCog,
    color: "from-emerald-600 to-emerald-800",
  },
  {
    title: "服务台",
    description: "过号处理，重新激活过号排到队尾",
    to: "/service",
    icon: Users,
    color: "from-amber-600 to-amber-800",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-government-700 text-white px-6 py-2 rounded-full text-sm font-medium mb-6">
            <Monitor size={18} />
            政务服务排队系统原型
          </div>
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            政务服务大厅
            <span className="text-government-700">取号排队系统</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            请选择需要进入的功能模块，所有数据均为前端 Mock 模拟
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.to}
                to={card.to}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${card.color}`}
                />
                <div className="p-10">
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${card.color} text-white mb-6 shadow-lg`}
                  >
                    <Icon size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-3 flex items-center gap-3">
                    {card.title}
                    <ArrowRight
                      size={22}
                      className="text-slate-300 group-hover:text-government-600 group-hover:translate-x-1 transition-all"
                    />
                  </h2>
                  <p className="text-slate-500 text-lg leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <div
                  className={`absolute -bottom-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-br ${card.color} opacity-10 group-hover:opacity-20 transition-opacity`}
                />
              </Link>
            );
          })}
        </div>

        <footer className="mt-20 text-center text-slate-400 text-sm">
          <p>
            提示：建议同时打开多个浏览器标签页，分别访问不同页面以模拟真实场景
          </p>
          <p className="mt-2">
            例如：一个标签页打开大屏，一个标签页打开取号，多个标签页打开各窗口
          </p>
        </footer>
      </div>
    </div>
  );
}
