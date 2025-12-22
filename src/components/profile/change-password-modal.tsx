"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";

const BRAND = "#00BFA5";
const BRAND_DARK = "#00a896";

interface Props {
    open: boolean;
    onClose: () => void;
}

export const ChangePasswordModal = ({ open, onClose }: Props) => {
    const [show, setShow] = useState(false);
    const [form, setForm] = useState({
        current: "",
        new: "",
        confirm: "",
    });

    const handleSubmit = () => {
        if (form.new !== form.confirm) {
            alert("Passwords do not match");
            return;
        }

        console.log("Change password:", form);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" style={{ color: BRAND }} />
                        Change Password
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Current */}
                    <div>
                        <Label>Current Password</Label>
                        <Input
                            type={show ? "text" : "password"}
                            value={form.current}
                            onChange={(e) =>
                                setForm({ ...form, current: e.target.value })
                            }
                        />
                    </div>

                    {/* New */}
                    <div>
                        <Label>New Password</Label>
                        <Input
                            type={show ? "text" : "password"}
                            value={form.new}
                            onChange={(e) =>
                                setForm({ ...form, new: e.target.value })
                            }
                        />
                    </div>

                    {/* Confirm */}
                    <div>
                        <Label>Confirm Password</Label>
                        <Input
                            type={show ? "text" : "password"}
                            value={form.confirm}
                            onChange={(e) =>
                                setForm({ ...form, confirm: e.target.value })
                            }
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                        {show ? <EyeOff size={16} /> : <Eye size={16} />}
                        {show ? "Hide passwords" : "Show passwords"}
                    </button>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        className="text-white"
                        style={{
                            background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DARK})`,
                        }}
                        onClick={handleSubmit}
                    >
                        Update Password
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
