import { BusinessType, WindowState, Ticket } from "@/types";

export const BUSINESS_TYPES: BusinessType[] = [
  {
    code: "social_security",
    name: "社保业务",
    prefix: "A",
    color: "bg-blue-600",
    description: "养老保险、医疗保险、失业保险等",
    avgServiceMinutes: 8,
  },
  {
    code: "tax",
    name: "税务业务",
    prefix: "B",
    color: "bg-emerald-600",
    description: "纳税申报、发票办理、税务登记等",
    avgServiceMinutes: 5,
  },
  {
    code: "industry",
    name: "工商业务",
    prefix: "C",
    color: "bg-amber-600",
    description: "企业注册、变更登记、营业执照等",
    avgServiceMinutes: 10,
  },
  {
    code: "real_estate",
    name: "房产业务",
    prefix: "D",
    color: "bg-rose-600",
    description: "不动产登记、房产过户、抵押登记等",
    avgServiceMinutes: 15,
  },
  {
    code: "household",
    name: "户籍业务",
    prefix: "E",
    color: "bg-violet-600",
    description: "户口迁移、身份证办理、户籍证明等",
    avgServiceMinutes: 6,
  },
  {
    code: "civil",
    name: "民政业务",
    prefix: "F",
    color: "bg-cyan-600",
    description: "婚姻登记、社会救助、优抚安置等",
    avgServiceMinutes: 7,
  },
];

export const INITIAL_WINDOWS: WindowState[] = [
  { id: 1, name: "1号窗口", status: "idle" },
  { id: 2, name: "2号窗口", status: "idle" },
  { id: 3, name: "3号窗口", status: "idle" },
  { id: 4, name: "4号窗口", status: "idle" },
  { id: 5, name: "5号窗口", status: "idle" },
  { id: 6, name: "6号窗口", status: "idle" },
];

const generateId = () => Math.random().toString(36).substring(2, 11);

const formatNumber = (prefix: string, seq: number) =>
  `${prefix}${String(seq).padStart(3, "0")}`;

export const generateInitialTickets = (): Ticket[] => {
  const tickets: Ticket[] = [];
  const now = Date.now();

  BUSINESS_TYPES.forEach((bt, idx) => {
    for (let i = 1; i <= 3; i++) {
      tickets.push({
        id: generateId(),
        number: formatNumber(bt.prefix, i),
        businessTypeCode: bt.code,
        status: "waiting",
        callCount: 0,
        createdAt: now - (idx * 3 + (4 - i)) * 60000,
      });
    }
  });

  return tickets.sort((a, b) => a.createdAt - b.createdAt);
};

export const SEQUENCE_INITIAL: Record<string, number> = BUSINESS_TYPES.reduce(
  (acc, bt) => ({ ...acc, [bt.code]: 4 }),
  {}
);
