import { useState } from "react";
import { LuEllipsis, LuPhone, LuCheck } from "react-icons/lu";
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

interface Loan {
  id: string;
  borrowerName: string;
  phone: string;
  amount: number;
  interestRate: number;
  disbursedDate: string;
  dueDate: string;
  status: "active" | "completed" | "overdue" | "defaulted";
}

const loans: Loan[] = [
  {
    id: "L001",
    borrowerName: "Amina Okafor",
    phone: "+2348012345678",
    amount: 500000,
    interestRate: 12,
    disbursedDate: "2026-03-10",
    dueDate: "2026-08-15",
    status: "active",
  },
  {
    id: "L002",
    borrowerName: "Ngozi Eze",
    phone: "+2349022233445",
    amount: 420000,
    interestRate: 10,
    disbursedDate: "2026-01-20",
    dueDate: "2026-06-20",
    status: "completed",
  },
  {
    id: "L003",
    borrowerName: "Chukwu Emeka",
    phone: "+2348098765432",
    amount: 380000,
    interestRate: 14,
    disbursedDate: "2026-02-15",
    dueDate: "2026-07-30",
    status: "overdue",
  },
  {
    id: "L004",
    borrowerName: "Fatima Bello",
    phone: "+2347055512345",
    amount: 350000,
    interestRate: 11,
    disbursedDate: "2026-04-01",
    dueDate: "2026-09-10",
    status: "active",
  },
  {
    id: "L005",
    borrowerName: "Yusuf Abdullahi",
    phone: "+2348077788990",
    amount: 310000,
    interestRate: 13,
    disbursedDate: "2026-05-12",
    dueDate: "2026-10-12",
    status: "active",
  },
  {
    id: "L006",
    borrowerName: "Tunde Adesanya",
    phone: "+2348133344556",
    amount: 250000,
    interestRate: 15,
    disbursedDate: "2026-06-01",
    dueDate: "2026-12-01",
    status: "defaulted",
  },
];

const statusConfig: Record<
  Loan["status"],
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  active: { label: "Active", variant: "default" },
  completed: { label: "Completed", variant: "outline" },
  overdue: { label: "Overdue", variant: "destructive" },
  defaulted: { label: "Defaulted", variant: "destructive" },
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

const LoansTab = () => {
  const [repayDialogOpen, setRepayDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  const handleRepayClick = (loan: Loan) => {
    setSelectedLoan(loan);
    setRepayDialogOpen(true);
  };

  const handleRepayConfirm = () => {
    setRepayDialogOpen(false);
    setSelectedLoan(null);
  };

  const handleRepayCancel = () => {
    setRepayDialogOpen(false);
    setSelectedLoan(null);
  };

  return (
    <>
      <div className="bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Borrower</TableHead>
              <TableHead>Loan Amount</TableHead>
              <TableHead>Interest</TableHead>
              <TableHead>Disbursed</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.map((loan) => {
              const { label, variant } = statusConfig[loan.status];
              return (
                <TableRow key={loan.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {loan.borrowerName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {loan.phone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(loan.amount)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {loan.interestRate}%
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(loan.disbursedDate)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(loan.dueDate)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={variant}>{label}</Badge>
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
                        {loan.status === "active" && (
                          <>
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault();
                                handleRepayClick(loan);
                              }}
                            >
                              <LuCheck className="size-4" />
                              Mark as Repaid
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        <DropdownMenuItem>
                          <a
                            href={`tel:${loan.phone}`}
                            className="flex items-center gap-2.5 no-underline inherit"
                          >
                            <LuPhone className="size-4" />
                            Contact
                          </a>
                        </DropdownMenuItem>
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
        open={repayDialogOpen}
        onOpenChange={(open) => !open && handleRepayCancel()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Repaid</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark the loan for{" "}
              {selectedLoan?.borrowerName} ({formatCurrency(selectedLoan?.amount ?? 0)})
              as repaid?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleRepayCancel}>
              Cancel
            </Button>
            <Button onClick={handleRepayConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoansTab;
