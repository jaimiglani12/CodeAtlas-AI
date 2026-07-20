import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, GitBranch } from "lucide-react";
import clsx from "clsx";

import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import { uploadRepository } from "../../api/repository";

interface Props {
    open: boolean;
    onClose: () => void;
    workspaceId: number;
}

export default function UploadRepositoryModal({ open, onClose, workspaceId }: Props) {

    const queryClient = useQueryClient();
    const [source, setSource] = useState<"zip" | "github">("github");
    const [name, setName] = useState("");
    const [githubUrl, setGithubUrl] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const mutation = useMutation({
        mutationFn: () =>
            uploadRepository(workspaceId, {
                name,
                file: source === "zip" ? file ?? undefined : undefined,
                githubUrl: source === "github" ? githubUrl : undefined,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["repositories", workspaceId] });
            setName("");
            setGithubUrl("");
            setFile(null);
            onClose();
        },
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!name.trim()) return;
        mutation.mutate();
    }

    return (
        <Modal open={open} onClose={onClose} title="Upload repository">

            <form onSubmit={handleSubmit} className="space-y-4">

                <div className="flex gap-2 rounded-sm border border-line bg-ink p-1">

                    <button
                        type="button"
                        onClick={() => setSource("github")}
                        className={clsx(
                            "flex flex-1 items-center justify-center gap-2 rounded-sm py-2 text-sm transition-colors",
                            source === "github" ? "bg-olive-800 text-olive-300" : "text-parchment-dim"
                        )}
                    >
                        <GitBranch size={15} />
                        GitHub
                    </button>

                    <button
                        type="button"
                        onClick={() => setSource("zip")}
                        className={clsx(
                            "flex flex-1 items-center justify-center gap-2 rounded-sm py-2 text-sm transition-colors",
                            source === "zip" ? "bg-olive-800 text-olive-300" : "text-parchment-dim"
                        )}
                    >
                        <Upload size={15} />
                        Upload ZIP
                    </button>

                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-medium text-parchment-dim">
                        Repository name
                    </label>
                    <Input
                        placeholder="codeatlas-backend"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />
                </div>

                {
                    source === "github" ? (

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-parchment-dim">
                                GitHub URL
                            </label>
                            <Input
                                placeholder="https://github.com/you/repo"
                                value={githubUrl}
                                onChange={(e) => setGithubUrl(e.target.value)}
                            />
                        </div>

                    ) : (

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-parchment-dim">
                                ZIP file
                            </label>
                            <label className="flex cursor-pointer items-center justify-center rounded-sm border border-dashed border-line-strong bg-ink px-4 py-6 text-sm text-parchment-dim transition-colors hover:border-olive-500 hover:text-parchment">
                                {file ? file.name : "Click to choose a .zip file"}
                                <input
                                    type="file"
                                    accept=".zip"
                                    className="hidden"
                                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                                />
                            </label>
                        </div>

                    )
                }

                {mutation.isError && (
                    <p className="text-xs text-walnut-300">
                        Couldn't upload the repository. Try again.
                    </p>
                )}

                <div className="flex justify-end gap-3 pt-1">

                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? <Spinner size={15} /> : "Upload"}
                    </Button>

                </div>

            </form>

        </Modal>
    );
}
