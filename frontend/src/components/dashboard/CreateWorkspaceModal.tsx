import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import { createWorkspace } from "../../api/workspace";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function CreateWorkspaceModal({ open, onClose }: Props) {

    const queryClient = useQueryClient();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const mutation = useMutation({
        mutationFn: createWorkspace,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
            setName("");
            setDescription("");
            onClose();
        },
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!name.trim()) return;
        mutation.mutate({ name, description });
    }

    return (
        <Modal open={open} onClose={onClose} title="Create workspace">

            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="mb-1.5 block text-xs font-medium text-parchment-dim">
                        Name
                    </label>
                    <Input
                        placeholder="AI Interviewer"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-medium text-parchment-dim">
                        Description
                    </label>
                    <Input
                        placeholder="FastAPI project for mock interviews"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {mutation.isError && (
                    <p className="text-xs text-walnut-300">
                        Couldn't create the workspace. Try again.
                    </p>
                )}

                <div className="flex justify-end gap-3 pt-1">

                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? <Spinner size={15} /> : "Create workspace"}
                    </Button>

                </div>

            </form>

        </Modal>
    );
}
