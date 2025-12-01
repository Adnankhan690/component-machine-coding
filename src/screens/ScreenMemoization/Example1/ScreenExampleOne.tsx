import "./example-one.css";
import { memo, useState, useMemo } from "react";
import Cards from "./components/Cards";
import Chip from "./components/Chip";

const MemoizedCard = memo(Cards);

export default function ScreenExanmpleOne() {
	const [score, setScore] = useState(100);

	const handleClick = () => {
		setScore(score + 100);
	};

	// Memoize the children to prevent re-creation on every render
	/* 2  */
	const memoizedChip = useMemo(() => <Chip label="Example Chip" />, []);

	return (
		<div className="example-screen">
			<h2>ScreenMemoization Example 1</h2>
			<p>
				This is the ScreenMemoization component demonstarte memo to memoize a
				component.
			</p>
			<button onClick={handleClick}>Increase Score {score}</button>
			{/* Comment MemoizedCard and uncomment Cards to see the difference in re-renders -> check logs  */}
			{/* <Cards /> */}

			{/* 1  */}
			{/* <MemoizedCard data={{ name: "Adnan" }} /> */}

			{/* 2  */}
			{/* ❌ Bad: Children recreated on every render - memo won't work */}
			{/* <MemoizedCard>
				<Chip label="Example Chip" />
			</MemoizedCard> */}

			{/* ✅ Good: Memoized children - memo will work properly */}
            {/* <MemoizedCard>{memoizedChip}</MemoizedCard> */}
            
            <MemoizedCard />
		</div>
	);
}

/*
    🟣 1. React.memo does shallow comparison (not deep)

    This is super important.

    Shallow comparison checks only:

    primitives by value

    objects/arrays by reference

    ➡️ If you pass new objects every time, memo becomes useless.

    ❌ Bad — object recreated everytime
    <MemoizedCard user={{ name: "Adnan" }} />;
*/

/*
    🟣 2. Functions as props cause re-renders

    Inline functions have new identity each render:

    <MemoizedCard func={() => {}} /> // ❌ new function every render


    Fix with useCallback:

    const handleClick = useCallback(() => {}, []);
    <MemoizedCard func={handleClick} />
*/

/*
    🟣 3. memo ignores children unless passed as props

    If you pass JSX children:

    <MemoizedCard>
    <SomeComponent />
    </MemoizedCard>


    Children become a prop, so memo compares new children.

    If children change → memo component re-renders.
*/

/*
    🟣 4. memo does NOT stop re-render caused by:
    ❌ internal state changes
    ❌ context value changes
    ❌ hooks depending on external values
    ❌ Redux or Zustand store updates inside the component

    Example:

    function Card() {
    const theme = useContext(ThemeContext); // change → re-render anyway
    }

    Even with memo, context updates bypass memo.
*/

/*
    🟣 5. You can use custom comparison function

    If you want deep compare or custom logic:

    memo(Cards, (prevProps, nextProps) => {
        return prevProps.value.id === nextProps.value.id;
    });


    But:

    ⚠ Deep comparison is expensive
    ⚠ Usually unnecessary
    ⚠ You might introduce performance issues
*/

/*
    🟣 6. Overusing memo = worse performance

    memo adds a comparison step.
    If the component is tiny:

    The cost of comparing props

    Might be more than re-rendering the component itself
*/

/*
    🟣 7. React.StrictMode double rendering confusion

    In development mode (not build):

    React renders twice (for dev checks).

    People think memo isn't working — but it is.
*/

/*
    🟢 Summary Table
    Case	Re-render?	Notes
    Parent re-renders	❌ No	If props unchanged
    Internal state change	✅ Yes	memo doesn't stop this
    Context value changes	✅ Yes	bypass memo
    New object/array prop	✅ Yes	reference change
    New inline function	✅ Yes	useCallback needed
    Same props reference	❌ No	memo works
*/

/*
    🏁 Final Summary

    React.memo is a performance optimization tool that prevents unnecessary re-renders by comparing previous props and next props.

    ✔ Use it for:
    Pure, heavy components
    Components inside frequently rendered parents
    List items, cards, rows, charts, expensive operations

    ❌ Avoid it when:
    Component is simple
    Props change every render
    You’re passing inline objects/functions
*/
