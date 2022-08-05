const Toggle = ({
    checked,
    onChange,
}) => {

    return (
        <div
            className="
    relative
    inline-block
    h-4
    w-8
    align-middle
    select-none
    transition
    duration-200
    ease-in
  "
        >
            <input
                checked={checked}
                onChange={(e) => {
                    onChange(e.target.checked);
                }}
                type="checkbox"
                name="toggle"
                className="
      toggle-checkbox
      absolute
      block
      w-4
      h-4
      rounded-full
      bg-gray
      appearance-none
      cursor-pointer
    "
            />
            <label
                htmlFor="toggle"
                className="
      toggle-label
      block
      overflow-hidden
      h-4
      rounded-full
      bg-teal
      bg-opacity-10
      cursor-pointer
    "
            ></label>
        </div>
    );
};
export default Toggle;
