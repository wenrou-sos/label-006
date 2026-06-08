import { Link } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  Users,
  Ticket as TicketIcon,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useQueueStore } from "@/store/queueStore";
import { usePolling } from "@/hooks/usePolling";
import { useState } from "react";

export default function ServicePage() {
  usePolling(1500);

  const passedTickets = useQueueStore((s) => s.getPassedTickets());
  const getWaitingCount = useQueueStore((s) => s.getWaitingCount);
  const getBusinessTypeByCode = useQueueStore((s) => s.getBusinessTypeByCode);
  const reactivateTicket = useQueueStore((s) => s.reactivateTicket);
  const totalWaiting = getWaitingCount();

  const [reactivated, setReactivated] = useState<string | null>(null);

  const handleReactivate = (ticketId: string) => {
    reactivateTicket(ticketId);
    setReactivated(ticketId);
    setTimeout(() => setReactivated(null), 1500);
  };

  const formatTime = (ts?: number) => {
    if (!ts) return "--";
    const d = new Date(ts);
    return `${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft size={20} />
              返回
            </Link>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                服务台 · 过号处理
              </h1>
              <p className="text-sm text-slate-500">
                政务服务大厅排队系统
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 text-slate-600">
              <Users size={22} className="text-government-600" />
              <span>总等待人数：</span>
              <span className="text-2xl font-bold text-government-700">
                {totalWaiting}
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <TicketIcon size={22} className="text-red-500" />
              <span>过号数量：</span>
              <span className="text-2xl font-bold text-red-600">
                {passedTickets.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-10 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">过号列表</h2>
                <p className="text-amber-100">
                  三次呼叫未到达的号码，可点击「重新排队」激活后排到队尾
                </p>
              </div>
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center">
                <RefreshCw size={40} />
              </div>
            </div>
          </div>

          {passedTickets.length === 0 ? (
            <div className="py-24 text-center">
              <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={64} className="text-green-500" />
              </div>
              <div className="text-3xl font-bold text-slate-700 mb-2">
                暂无过号记录
              </div>
              <p className="text-xl text-slate-400">
                所有排队号码均正常处理中
              </p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-12 px-10 py-5 bg-slate-50 border-b border-slate-200 text-slate-500 text-lg font-medium">
                <div className="col-span-2">号码</div>
                <div className="col-span-3">业务类型</div>
                <div className="col-span-2">过号时间</div>
                <div className="col-span-2">呼叫次数</div>
                <div className="col-span-3 text-right">操作</div>
              </div>

              <div className="divide-y divide-slate-100">
                {passedTickets.map((t) => {
                  const bt = getBusinessTypeByCode(t.businessTypeCode);
                  const isReactivated = reactivated === t.id;
                  return (
                    <div
                      key={t.id}
                      className={`grid grid-cols-12 px-10 py-6 items-center transition-colors ${
                        isReactivated ? "bg-green-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="col-span-2">
                        <span className="text-4xl font-black text-red-600">
                          {t.number}
                        </span>
                      </div>
                      <div className="col-span-3">
                        <div className="flex items-center gap-3">
                          {bt && (
                            <div
                              className={`w-10 h-10 rounded-xl ${bt.color} flex items-center justify-center text-white font-bold text-lg`}
                            >
                              {bt.prefix}
                            </div>
                          )}
                          <span className="text-xl font-medium text-slate-700">
                            {bt?.name || "--"}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock size={20} />
                          <span className="text-lg font-medium">
                            {formatTime(t.calledAt)}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-xl text-lg font-bold">
                          {t.callCount} 次
                        </span>
                      </div>
                      <div className="col-span-3 text-right">
                        {isReactivated ? (
                          <span className="inline-flex items-center gap-2 px-6 py-4 bg-green-500 text-white rounded-2xl text-lg font-bold">
                            <CheckCircle2 size={22} />
                            已重新排队
                          </span>
                        ) : (
                          <button
                            onClick={() => handleReactivate(t.id)}
                            className="inline-flex items-center gap-2 px-6 py-4 bg-gradient-to-br from-government-600 to-government-800 text-white rounded-2xl text-lg font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all active:translate-y-0"
                          >
                            <RefreshCw size={22} />
                            重新排队
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow p-8">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
              <TicketIcon size={28} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              什么是过号？
            </h3>
            <p className="text-slate-500 leading-relaxed">
              当一个号码被呼叫3次后，持号人仍未到达窗口办理，系统将自动标记为「过号」状态。
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-8">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
              <RefreshCw size={28} className="text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              如何重新激活？
            </h3>
            <p className="text-slate-500 leading-relaxed">
              过号市民可凭号票到服务台，由工作人员点击「重新排队」将该号码排到队尾。
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-8">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
              <Users size={28} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              注意事项
            </h3>
            <p className="text-slate-500 leading-relaxed">
              请提醒市民留意大屏幕和广播信息，避免错过叫号，过号多次会影响办理效率。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
