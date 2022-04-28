export const AccountPanel = () => {
    // There will need to be some sort of check here for if a user is already logged in, etc.
    return (
        <div className="w-5/6 mx-auto">
            <form>
                <fieldset>
                    <label>
                        <div className="w-fit mx-auto">
                            <div className="pb-2 w-full mx-auto">
                                <input className="py-2 pl-2 pr-24 rounded-lg bg-[#FFF] dark:bg-[#222] border border-slate-200 focus:outline-none focus:border-[#F7BCB1] focus:ring-1 focus:ring-[#F7BCB1]" name="name" type='text' placeholder="Username" />
                            </div>
                            <div className="pb-2 w-full mx-auto">
                                <input className="py-2 pl-2 pr-24 rounded-lg bg-[#FFF] dark:bg-[#222] border border-slate-200 focus:outline-none focus:border-[#F7BCB1] focus:ring-1 focus:ring-[#F7BCB1]" name="name" type='password' placeholder="Password" />
                            </div>
                            <div className="mx-auto flex items-center justify-end">
                                <button className="px-4 py-1 bg-[#FFF] dark:bg-[#F7BCB1] text-[#F7BCB1] dark:text-[#222] border border-[#F7BCB1] rounded-lg" onClick={() => {}}>Login</button>
                            </div>
                        </div>
                    </label>
                </fieldset>                
            </form>
        </div>
    )    
}