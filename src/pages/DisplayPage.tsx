import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Users, Volume2, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { useQueueStore } from "@/store/queueStore";
import { usePolling } from "@/hooks/usePolling";
import type { Ticket, TicketStatus } from "@/types";
import { estimateWaitTime, formatWaitTime } from "@/lib/utils";

const getStatusColor = (status: TicketStatus) => {
  switch (status) {
    case "called":
      return "bg-green-500 border-green-400";
    case "serving":
      return "bg-yellow-500 border-yellow-400";
    case "passed":
      return "bg-red-500 border-red-400";
    default:
      return "bg-slate-500 border-slate-400";
  }
};

const getStatusText = (status: TicketStatus) => {
  switch (status) {
    case "called":
      return "已叫号";
    case "serving":
      return "办理中";
    case "passed":
      return "已过号";
    default:
      return "等待中";
  }
};

const getNumberTextColor = (status: TicketStatus) => {
  switch (status) {
    case "called":
      return "text-green-400";
    case "serving":
      return "text-yellow-400";
    case "passed":
      return "text-red-400";
    default:
      return "text-slate-300";
  }
};

export default function DisplayPage() {
  usePolling(1500);

  const windows = useQueueStore((s) => s.windows);
  const getWindowCurrentTicket = useQueueStore((s) => s.getWindowCurrentTicket);
  const getBusinessTypeByCode = useQueueStore((s) => s.getBusinessTypeByCode);
  const getWaitingCount = useQueueStore((s) => s.getWaitingCount);
  const getRecentDisplayEvents = useQueueStore((s) => s.getRecentDisplayEvents);
  const businessTypes = useQueueStore((s) => s.businessTypes);

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatDate = (d: Date) => {
    const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 星期${weekDays[d.getDay()]}`;
  };
  const formatTime = (d: Date) =>
    `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;

  const windowTickets: {
    windowId: number;
    windowName: string;
    ticket?: Ticket;
  }[] = windows.map((w) => ({
    windowId: w.id,
    windowName: w.name,
    ticket: getWindowCurrentTicket(w.id),
  }));

  const recentEvents = getRecentDisplayEvents(8);
  const totalWaiting = getWaitingCount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-government-950 to-slate-900 text-white flex flex-col overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={18} />
          返回
        </Link>
      </div>

      <header className="pt-8 pb-6 px-12 relative">
        <div className="text-center">
          <h1 className="text-6xl font-bold tracking-wider mb-2 text-shadow-lg bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
            政务服务大厅
          </h1>
          <p className="text-3xl text-blue-200/80 tracking-widest">
            智能排队叫号系统
          </p>
        </div>

        <div className="flex justify-between items-end mt-6 px-4">
          <div className="flex items-center gap-3 text-xl text-blue-200">
            <Clock size={24} />
            <span>{formatDate(now)}</span>
            <span className="text-4xl font-mono font-bold text-white ml-2">
              {formatTime(now)}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xl text-blue-200">
            <Users size={24} />
            <span>当前等待：</span>
            <span className="text-4xl font-bold text-yellow-400">
              {totalWaiting}
            </span>
            <span>人</span>
            <Volume2 size={24} className="ml-4 animate-pulse text-green-400" />
          </div>
        </div>
      </header>

      <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

      <div className="flex-1 flex px-12 py-8 gap-8 min-h-0">
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-1 w-8 bg-blue-500 rounded" />
            <h2 className="text-3xl font-bold text-blue-200">窗口叫号</h2>
          </div>

          <div className="grid grid-cols-2 gap-6 h-full content-start">
            {windowTickets.map(({ windowId, windowName, ticket }) => {
              const bt = ticket
                ? getBusinessTypeByCode(ticket.businessTypeCode)
                : null;
              const status = ticket?.status || ("waiting" as TicketStatus);
              const isFlashing = ticket?.status === "called";

              return (
                <div
                  key={windowId}
                  className={`relative bg-slate-800/60 backdrop-blur rounded-3xl p-8 border-2 ${
                    ticket ? getStatusColor(status) : "border-slate-700"
                  } transition-all duration-500`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-xl text-blue-200/80 mb-1">
                        服务窗口
                      </div>
                      <div className="text-5xl font-bold text-white">
                        {windowName}
                      </div>
                    </div>
                    {ticket && (
                      <div
                        className={`px-4 py-2 rounded-xl text-lg font-bold ${getStatusColor(
                          status
                        )} text-white ${
                          isFlashing ? "animate-pulse-fast" : ""
                        }`}
                      >
                        {getStatusText(status)}
                      </div>
                    )}
                  </div>

                  <div className="text-center py-6">
                    {ticket ? (
                      <div
                        className={`${isFlashing ? "animate-flash" : ""}`}
                      >
                        <div
                          className={`text-display-2xl font-black tracking-wider ${getNumberTextColor(
                            status
                          )} text-shadow-lg`}
                        >
                          {ticket.number}
                        </div>
                        {bt && (
                          <div className="text-2xl text-slate-300 mt-2">
                            {bt.name}
                          </div>
                        )}
                        {ticket.callCount > 1 && (
                          <div className="mt-3 inline-flex items-center gap-2 text-lg text-orange-400">
                            第 {ticket.callCount} 次呼叫
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-10">
                        <div className="text-display-lg font-bold text-slate-600">
                          --
                        </div>
                        <div className="text-2xl text-slate-500 mt-2">
                          空闲中
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    className={`absolute -z-10 inset-0 rounded-3xl ${
                      ticket ? getStatusColor(status) : "bg-slate-700"
                    } opacity-5`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-96 flex flex-col min-h-0">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-1 w-8 bg-yellow-500 rounded" />
            <h2 className="text-3xl font-bold text-blue-200">等待人数</h2>
          </div>

          <div className="bg-slate-800/60 backdrop-blur rounded-3xl p-6 mb-6">
            <div className="space-y-4">
              {businessTypes.map((bt) => {
                const count = getWaitingCount(bt.code);
                const estMinutes = estimateWaitTime(count, bt.avgServiceMinutes);
                return (
                  <div
                    key={bt.code}
                    className="bg-slate-900/50 rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl ${bt.color} flex items-center justify-center text-2xl font-bold text-white`}
                        >
                          {bt.prefix}
                        </div>
                        <div>
                          <div className="text-xl font-bold text-white">
                            {bt.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-3xl font-black ${
                            count > 5 ? "text-yellow-400" : "text-green-400"
                          }`}
                        >
                          {count} <span className="text-base font-medium text-slate-400">人</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-amber-300 pl-16">
                      <Timer size={18} />
                      <span className="text-lg font-medium">
                        预估等待 {formatWaitTime(estMinutes)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-4 flex items-center gap-3">
            <div className="h-1 w-8 bg-green-500 rounded" />
            <h2 className="text-3xl font-bold text-blue-200">最近叫号</h2>
          </div>

          <div className="flex-1 bg-slate-800/60 backdrop-blur rounded-3xl p-6 overflow-hidden">
            {recentEvents.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-2xl">
                暂无叫号记录
              </div>
            ) : (
              <div className="space-y-3">
                {recentEvents.map((e, idx) => (
                  <div
                    key={e.id}
                    className={`flex items-center justify-between rounded-2xl p-4 ${
                      idx === 0
                        ? "bg-green-500/10 border border-green-500/30"
                        : "bg-slate-900/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`text-3xl font-black ${
                          idx === 0
                            ? "text-green-400 animate-pulse"
                            : "text-slate-300"
                        }`}
                      >
                        {e.ticketNumber}
                      </div>
                      {e.type === "recall" && (
                        <span className="text-xs px-2 py-1 rounded bg-orange-500/20 text-orange-300">
                          重呼
                        </span>
                      )}
                    </div>
                    <div className="text-xl text-blue-200 font-medium">
                      {e.windowName}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-900/80 border-t border-slate-700 h-16 overflow-hidden flex items-center">
        <div className="flex-shrink-0 px-8 bg-government-700 h-full flex items-center text-xl font-bold">
          温馨提示
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap text-2xl text-blue-200 py-2">
            欢迎来到政务服务大厅 · 请有序排队 · 过号三次将重新排队 ·
            如有疑问请咨询服务台工作人员 · 请保管好您的随身物品 ·
            办理业务请携带相关证件 · 感谢您的配合与支持
          </div>
        </div>
      </div>
    </div>
  );
}
