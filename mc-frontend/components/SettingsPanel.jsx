export const SettingsPanel = () => {
  return (
    <form className="w-full">
      <fieldset>
        <label className="flex justify-start pb-2">
          Default Weather Location
        </label>
        <div className="pb-2 w-full">
          <select className="py-2 px-2 w-full rounded-lg bg-[#f0f0f0] dark:bg-[#222] border border-slate-200 focus:outline-none focus:border-[#F7BCB1] focus:ring-1 focus:ring-[#F7BCB1]">
            <option value="">test</option>
            {/* Put weather location map here for option tags */}
          </select>
        </div>
      </fieldset>
    </form>
  );
};
