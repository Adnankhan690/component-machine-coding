//1. arrow function is equivalent to `Boolean`. Use `Boolean` directly.
const isDisabled = !filterValues.some((v) => Boolean(v));

sol: const isDisabled = !filterValues.some(Boolean);

//2. Mark the props of the component as read-only.
 export default function TimeFilter({
	selectedRange,
	setSelectedRange,
	startDate,
	setStartDate,
	endDate,
	setEndDate,
}: {
	selectedRange: string;
	setSelectedRange: (val: string) => void;
	startDate: Date | undefined;
	setStartDate: (date: Date | undefined) => void;
	endDate: Date | undefined;
	setEndDate: (date: Date | undefined) => void;
}) {}

sol:  export default function TimeFilter({
	selectedRange,
	setSelectedRange,
	startDate,
	setStartDate,
	endDate,
	setEndDate,
}: {
	`readonly` selectedRange: string;
	`readonly` setSelectedRange: (val: string) => void;
	`readonly` startDate: Date | undefined;
	`readonly` setStartDate: (date: Date | undefined) => void;
	`readonly` endDate: Date | undefined;
	`readonly` setEndDate: (date: Date | undefined) => void;
}) {}



//3. 'value' may use Object's default stringification format ('[object Object]') when stringified.
		if (!isInSearchSet && value) {
			url += `${key}=${value}&`;
		}

sol: if (!isInSearchSet && value && typeof value === 'string') {
			url += `${key}=${value}&`;
		}


//4. Extract this nested ternary operation into an independent statement.
	const accountType =
		Number(account_type_id) === 2
			? 'KYC 1'
			: Number(account_type_id) === 1
				? 'KYC 0'
				: null;

sol: 	// Map account_type_id to KYC level
	const ACCOUNT_TYPE_MAP: Record<number, string> = {
		1: 'KYC 0',
		2: 'KYC 1',
	};
	const accountType = account_type_id ? ACCOUNT_TYPE_MAP[Number(account_type_id)] ?? null : null;


5. ❌ Don’t set state in cleanup

This is a serious React anti-pattern:

 useEffect(() => {
    fn()
      .then((result) => {
        setStatusObj({ status: "success", data: result });
      })
      .catch((error) => {
        setStatusObj({ status: "error", error });
      });

	//This is the issue
    return () => {
      setStatusObj({
        status: "loading",
      });
    };
 }, [])

Cleanup runs:
	- on unmount
	- before the effect re-runs

Setting state during cleanup can cause:
	- memory leaks
	- React warnings
    - unexpected rerenders