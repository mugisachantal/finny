import { useState } from "react";
import { LuEllipsis, LuHistory, LuUserX, LuPhone } from "react-icons/lu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Application {
  id: string;
  clientName: string;
  phone: string;
  loanAmount: number;
  status: "pending" | "approved" | "overdue" | "paid";
  dueDate: string;
}

const applications: Application[] = [
  {
    id: "1",
    clientName: "Amina Okafor",
    phone: "+2348012345678",
    loanAmount: 250000,
    status: "approved",
    dueDate: "2026-08-15",
  },
  {
    id: "2",
    clientName: "Chukwu Emeka",
    phone: "+2348098765432",
    loanAmount: 150000,
    status: "pending",
    dueDate: "2026-08-20",
  },
  {
    id: "3",
    clientName: "Fatima Bello",
    phone: "+2347055512345",
    loanAmount: 500000,
    status: "overdue",
    dueDate: "2026-06-30",
  },
  {
    id: "4",
    clientName: "Tunde Adesanya",
    phone: "+2348133344556",
    loanAmount: 75000,
    status: "paid",
    dueDate: "2026-07-01",
  },
  {
    id: "5",
    clientName: "Ngozi Eze",
    phone: "+2349022233445",
    loanAmount: 320000,
    status: "approved",
    dueDate: "2026-09-10",
  },
  {
    id: "6",
    clientName: "Yusuf Abdullahi",
    phone: "+2348077788990",
    loanAmount: 180000,
    status: "pending",
    dueDate: "2026-08-25",
  },
];

const statusConfig: Record<
  Application["status"],
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  pending: { label: "Pending", variant: "secondary" },
  approved: { label: "Approved", variant: "default" },
  overdue: { label: "Overdue", variant: "destructive" },
  paid: { label: "Paid", variant: "outline" },
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX" }).format(
    amount,
  );

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-UG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const ApplicationsTab = () => {
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Application | null>(
    null,
  );
  const [blockReason, setBlockReason] = useState("");

  const handleBlockClick = (app: Application) => {
    setSelectedClient(app);
    setBlockDialogOpen(true);
  };

  const handleBlockConfirm = () => {
    setBlockDialogOpen(false);
    setBlockReason("");
    setSelectedClient(null);
  };

  const handleBlockCancel = () => {
    setBlockDialogOpen(false);
    setBlockReason("");
    setSelectedClient(null);
  };

  return (
    <>
      <div className="bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Client</TableHead>
              <TableHead>Loan Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => {
              const { label, variant } = statusConfig[app.status];
              return (
                <TableRow key={app.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {app.clientName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {app.phone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(app.loanAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={variant}>{label}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(app.dueDate)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Actions"
                          />
                        }
                      >
                        <LuEllipsis className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <LuHistory className="size-4" />
                          View Client History
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <LuUserX className="size-4" />
                            Manage Client
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              variant="destructive"
                              onSelect={(e) => {
                                e.preventDefault();
                                handleBlockClick(app);
                              }}
                            >
                              <LuUserX className="size-4" />
                              Block from Requesting Loans
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <a
                                href={`tel:${app.phone}`}
                                className="flex items-center gap-2.5 no-underline inherit"
                              >
                                <LuPhone className="size-4" />
                                Contact
                              </a>
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={blockDialogOpen}
        onOpenChange={(open) => !open && handleBlockCancel()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block Client</DialogTitle>
            <DialogDescription>
              Are you sure you want to block {selectedClient?.clientName} from
              requesting loans? This action can be reversed later.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="block-reason"
              className="text-sm font-medium text-foreground"
            >
              Reason for blocking
            </label>
            <textarea
              id="block-reason"
              placeholder="Enter the reason for blocking this client..."
              className="min-h-24 rounded-2xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleBlockCancel}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!blockReason.trim()}
              onClick={handleBlockConfirm}
            >
              Block Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApplicationsTab;
