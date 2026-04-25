function MacTypeContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 bg-white p-[50px] rounded-[12px] shadow-[inset_#0000007d_-4px_-3px_6px_1px,_#00000075_2px_2px_0px_1px]">
            {children}
        </div>
    );
}

export default MacTypeContainer;