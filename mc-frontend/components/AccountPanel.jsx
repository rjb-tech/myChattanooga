export const AccountPanel = () => {
    // There will need to be some sort of check here for if a user is already logged in, etc.
    return (
        <form className="">
            <fieldset>
                <label>
                    <div className="pb-2 w-full md:w-2/3">
                        <input className="py-2 pl-2 pr-24 rounded-lg bg-[#FFF] dark:bg-[#222] border border-slate-200 focus:outline-none focus:border-[#F7BCB1] focus:ring-1 focus:ring-[#F7BCB1]" name="name" type='text' placeholder="Username" />
                    </div>
                    <div className="pb-2 w-full md:w-2/3">
                        <input className="py-2 pl-2 pr-24 rounded-lg bg-[#FFF] dark:bg-[#222] border border-slate-200 focus:outline-none focus:border-[#F7BCB1] focus:ring-1 focus:ring-[#F7BCB1]" name="name" type='password' placeholder="Password" />
                    </div>
                    <div className="mx-auto md:w-2/3 flex items-center justify-end">
                        <button className="px-4 py-1 bg-[#FFF] dark:bg-[#F7BCB1] text-[#F7BCB1] dark:text-[#222] border border-[#F7BCB1] rounded-lg" onClick={() => {}}>Login</button>
                    </div>
                </label>
            </fieldset>                
        </form>
    )    
}