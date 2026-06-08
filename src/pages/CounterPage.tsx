import { useParams, Link, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  UserPlus,
  Volume2,
  CheckCircle2,
  XCircle,
  Users,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useQueueStore } from "@/store/queueStore";
import { usePolling } from "@/hooks/usePolling";
import { useEffect, useState } from "react";

export default function CounterPage() {
  const { id } = useParams<{ id: string }>();
  const windowId = Number(id);

  usePolling(1500);

  const windows = useQueueStore((s) => s.windows);
  const getWindowById = useQueueStore((s) => s.getWindowById);
  const getWindowCurrentTicket = useQueueStore((s) => s.getWindowCurrentTicket);
  const getBusinessTypeByCode = useQueueStore((s) => s.getBusinessTypeByCode);
  const getWaitingCount = useQueueStore((s) => s.getWaitingCount);
  const callNext = useQueueStore((s) => s.callNext);
  const recall = useQueueStore((s) => s.recall);
  const startService = useQueueStore((s) => s.startService);
  const completeService = useQueueStore((s) => s.completeService);
  const markPassed = useQueueStore((s) => s.markPassed);

  const [flashKey, setFlashKey] = useState(0);

  const window = getWindowById(windowId);
  const currentTicket = getWindowCurrentTicket(windowId);
  const bt = currentTicket
    ? getBusinessTypeByCode(currentTicket.businessTypeCode)
    : null;

  const totalWaiting = getWaitingCount();

  useEffect(() => {
    if (currentTicket) {
      setFlashKey((k) => k + 1);
    }
  }, [currentTicket?.id, currentTicket?.callCount]);

  if (!window || isNaN(windowId)) {
    return <Navigate to="/" replace />;
  }

  const handleCallNext = () => {
    callNext(windowId, true);
  };

  const getStatusLabel = () => {
    if (!currentTicket) return { text: "空闲", color: "bg-slate-500" };
    switch (currentTicket.status) {
      case "called":
        return { text: "已叫号，等待到达", color: "bg-green-600" };
      case "serving":
        return { text: "办理中", color: "bg-yellow-600" };
      case "passed":
        return { text: "已过号", color: "bg-red-600" };
      default:
        return { text: "空闲", color: "bg-slate-500" };
    }
  };

  const statusLabel = getStatusLabel();
  const canCallNext = !currentTicket || currentTicket.status === "completed" || currentTicket.status === "passed";
  const canRecall = currentTicket?.status === "called";
  const canStart = currentTicket?.status === "called";
  const canComplete = currentTicket?.status === "serving";
  const canPass = currentTicket?.status === "called";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
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
                {window.name} · 工作台
              </h1>
              <p className="text-sm text-slate-500">政务服务大厅排队系统</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-6">
              {windows
                .filter((w) => w.id !== windowId)
                .slice(0, 3)
                .map((w) => (
                  <Link
                    key={w.id}
                    to={`/counter/${w.id}`}
                    className="flex items-center gap-2 text-slate-500 hover:text-government-700 transition-colors"
                  >
                    {w.name}
                  </Link>
                ))}
            </div>
            <div className="flex items-center gap-4">
              <Link
                to={`/counter/${Math.max(1, windowId - 1)}`}
                className={`p-2 rounded-lg ${
                  windowId <= 1
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                onClick={(e) => windowId <= 1 && e.preventDefault()}
              >
                <ChevronLeft size={24} />
              </Link>
              <Link
                to={`/counter/${Math.min(windows.length, windowId + 1)}`}
                className={`p-2 rounded-lg ${
                  windowId >= windows.length
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                onClick={(e) =>
                  windowId >= windows.length && e.preventDefault()
                }
              >
                <ChevronRight size={24} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div
                className={`${statusLabel.color} px-10 py-6 text-white flex items-center justify-between`}
              >
                <div>
                  <div className="text-sm opacity-90 mb-1">当前状态</div>
                  <div className="text-3xl font-bold">{statusLabel.text}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-90 mb-1">总等待人数</div>
                  <div className="text-3xl font-bold flex items-center gap-2 justify-end">
                    <Users size={28} />
                    {totalWaiting}
                  </div>
                </div>
              </div>

              <div className="p-12 text-center">
                {currentTicket && bt ? (
                  <div key={flashKey} className="animate-scale-in">
                    <div className="text-slate-400 text-xl mb-4">
                      当前办理号码
                    </div>
                    <div
                      className={`text-display-2xl font-black tracking-wider mb-4 ${
                        currentTicket.status === "called"
                          ? "text-green-600 animate-pulse-fast"
                          : currentTicket.status === "serving"
                          ? "text-yellow-600"
                          : currentTicket.status === "passed"
                          ? "text-red-600"
                          : "text-slate-800"
                      }`}
                    >
                      {currentTicket.number}
                    </div>
                    <div className="text-3xl text-slate-600 font-medium mb-6">
                      {bt.name}
                    </div>

                    {currentTicket.status === "called" && (
                      <div className="inline-flex items-center gap-2 px-5 py-3 bg-orange-50 text-orange-700 rounded-2xl text-xl font-medium">
                        <AlertTriangle size={24} />
                        已呼叫 {currentTicket.callCount} 次（共3次）
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-16">
                    <div className="text-9xl font-black text-slate-100 mb-4">
                      --
                    </div>
                    <div className="text-3xl text-slate-400">
                      暂无办理业务
                    </div>
                    <p className="text-xl text-slate-300 mt-3">
                      点击下方「呼叫下一位」开始叫号
                    </p>
                  </div>
                )}
              </div>

              <div className="px-12 pb-12">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleCallNext}
                    disabled={!canCallNext}
                    className={`py-8 rounded-2xl text-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                      canCallNext
                        ? "bg-gradient-to-br from-government-600 to-government-800 text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <UserPlus size={32} />
                    呼叫下一位
                  </button>

                  <button
                    onClick={() => recall(windowId)}
                    disabled={!canRecall}
                    className={`py-8 rounded-2xl text-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                      canRecall
                        ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <Volume2 size={32} />
                    重复呼叫
                  </button>

                  <button
                    onClick={() => startService(windowId)}
                    disabled={!canStart}
                    className={`py-8 rounded-2xl text-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                      canStart
                        ? "bg-gradient-to-br from-yellow-500 to-yellow-700 text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <CheckCircle2 size={32} />
                    开始办理
                  </button>

                  <button
                    onClick={() => completeService(windowId)}
                    disabled={!canComplete}
                    className={`py-8 rounded-2xl text-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                      canComplete
                        ? "bg-gradient-to-br from-emerald-500 to-emerald-700 text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <CheckCircle2 size={32} />
                    办理完成
                  </button>
                </div>

                <button
                  onClick={() => markPassed(windowId)}
                  disabled={!canPass}
                  className={`w-full mt-4 py-6 rounded-2xl text-xl font-bold flex items-center justify-center gap-3 transition-all ${
                    canPass
                      ? "bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100"
                      : "bg-slate-50 text-slate-300 border-2 border-slate-100 cursor-not-allowed"
                  }`}
                >
                  <XCircle size={26} />
                  标记过号（3次未到自动过号）
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-4 space-y-6">
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                操作说明
              </h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-government-100 text-government-700 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <span>点击「呼叫下一位」叫下一位排队者</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-government-100 text-government-700 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <span>市民到达后点击「开始办理」</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-government-100 text-government-700 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <span>重复呼叫最多3次，未到自动过号</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-government-100 text-government-700 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    4
                  </span>
                  <span>办理完成后点击「办理完成」</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                各业务等待人数
              </h3>
              <div className="space-y-3">
                {useQueueStore.getState().businessTypes.map((bt) => {
                  const c = getWaitingCount(bt.code);
                  return (
                    <div
                      key={bt.code}
                      className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg ${bt.color} flex items-center justify-center text-white font-bold`}
                        >
                          {bt.prefix}
                        </div>
                        <span className="text-slate-700">{bt.name}</span>
                      </div>
                      <span
                        className={`text-2xl font-bold ${
                          c > 0 ? "text-government-700" : "text-slate-300"
                        }`}
                      >
                        {c}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
