import { useState } from "react";
import {
  Building2,
  ReceiptIndianRupee,
  Briefcase,
  Home as HomeIcon,
  UserCheck,
  HeartHandshake,
  ArrowLeft,
  Users,
  Clock,
  QrCode,
  CheckCircle2,
  Timer,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQueueStore } from "@/store/queueStore";
import type { Ticket } from "@/types";
import type { LucideIcon } from "lucide-react";
import { estimateWaitTime, formatWaitTime } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  social_security: HeartHandshake,
  tax: ReceiptIndianRupee,
  industry: Briefcase,
  real_estate: HomeIcon,
  household: UserCheck,
  civil: Building2,
};

export default function TicketPage() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const businessTypes = useQueueStore((s) => s.businessTypes);
  const takeTicket = useQueueStore((s) => s.takeTicket);
  const getWaitingCount = useQueueStore((s) => s.getWaitingCount);
  const getBusinessTypeByCode = useQueueStore((s) => s.getBusinessTypeByCode);

  const handleTakeTicket = (code: string) => {
    const ticket = takeTicket(code);
    if (ticket) {
      setSelectedTicket(ticket);
    }
  };

  const bt = selectedTicket ? getBusinessTypeByCode(selectedTicket.businessTypeCode) : null;

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  if (selectedTicket && bt) {
    const waitingCount = getWaitingCount(selectedTicket.businessTypeCode);
    const estMinutes = estimateWaitTime(waitingCount, bt.avgServiceMinutes);
    return (
      <div className="min-h-screen bg-gradient-to-br from-government-700 via-government-800 to-government-950 flex flex-col">
        <div className="p-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-lg"
          >
            <ArrowLeft size={24} />
            返回首页
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 pb-16">
          <div className="animate-scale-in">
            <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden max-w-lg w-full">
              <div className="bg-gradient-to-br from-government-600 to-government-800 p-10 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white" />
                  <div className="absolute -bottom-20 -right-10 w-56 h-56 rounded-full bg-white" />
                </div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur mb-6">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-2xl font-medium opacity-90 mb-2">
                    您的排队号码
                  </h2>
                  <div className="text-display-xl font-bold tracking-wider text-shadow-lg">
                    {selectedTicket.number}
                  </div>
                </div>
              </div>

              <div className="p-10 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-5 text-center">
                    <div className="text-slate-500 text-sm mb-2">业务类型</div>
                    <div className="text-xl font-bold text-slate-800">
                      {bt.name}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5 text-center">
                    <div className="text-slate-500 text-sm mb-2">前面等待</div>
                    <div className="text-xl font-bold text-government-700 flex items-center justify-center gap-1">
                      <Users size={22} />
                      {waitingCount}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5 text-center">
                    <div className="text-slate-500 text-sm mb-2">预估等待</div>
                    <div className="text-xl font-bold text-amber-600 flex items-center justify-center gap-1">
                      <Timer size={22} />
                      {formatWaitTime(estMinutes)}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 flex items-center justify-between">
                  <div>
                    <div className="text-slate-500 text-sm mb-1">取号时间</div>
                    <div className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <Clock size={20} />
                      {formatTime(selectedTicket.createdAt)}
                    </div>
                  </div>
                  <div className="w-20 h-20 bg-white rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center">
                    <QrCode size={48} className="text-slate-400" />
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                  <p className="text-amber-800 text-center leading-relaxed">
                    请留意大厅广播和显示屏叫号信息
                    <br />
                    <span className="font-semibold">过号三次需到服务台重新取号</span>
                  </p>
                </div>

                <button
                  onClick={() => setSelectedTicket(null)}
                  className="w-full py-6 bg-government-700 hover:bg-government-800 text-white text-2xl font-bold rounded-2xl transition-colors"
                >
                  继续取号
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-government-700 via-government-800 to-government-950 flex flex-col">
      <header className="p-8 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-lg"
        >
          <ArrowLeft size={24} />
          返回
        </Link>
        <div className="text-white text-2xl font-bold tracking-wide">
          政务服务大厅 · 自助取号
        </div>
        <div className="w-20" />
      </header>

      <div className="text-center py-8 px-8">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 text-shadow-md">
          请选择您要办理的业务
        </h1>
        <p className="text-white/70 text-2xl">
          点击下方业务类型卡片即可取号
        </p>
      </div>

      <div className="flex-1 px-8 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8">
          {businessTypes.map((bt) => {
            const Icon = iconMap[bt.code] || Building2;
            const waiting = getWaitingCount(bt.code);
            const estMinutes = estimateWaitTime(waiting, bt.avgServiceMinutes);
            return (
              <button
                key={bt.code}
                onClick={() => handleTakeTicket(bt.code)}
                className="group relative bg-white rounded-3xl p-10 text-left hover:scale-105 active:scale-95 transition-all duration-200 shadow-2xl overflow-hidden"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-3 ${bt.color}`}
                />
                <div
                  className={`inline-flex items-center justify-center w-24 h-24 rounded-3xl ${bt.color} text-white mb-6 shadow-lg`}
                >
                  <Icon size={48} />
                </div>
                <h3 className="text-4xl font-bold text-slate-800 mb-3">
                  {bt.name}
                </h3>
                <p className="text-slate-500 text-xl mb-6 leading-relaxed">
                  {bt.description}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users size={24} />
                    <span className="text-xl font-medium">
                      当前等待 <span className="text-3xl font-bold text-government-700">{waiting}</span> 人
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-600">
                    <Timer size={24} />
                    <span className="text-xl font-medium">
                      预估等待 <span className="text-2xl font-bold">{formatWaitTime(estMinutes)}</span>
                    </span>
                  </div>
                </div>
                <div className="absolute right-8 bottom-8 text-6xl font-bold text-slate-200 group-hover:text-government-200 transition-colors">
                  {bt.prefix}
                </div>
                <div
                  className={`absolute -bottom-16 -right-16 w-48 h-48 rounded-full ${bt.color} opacity-5 group-hover:opacity-10 transition-opacity`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
