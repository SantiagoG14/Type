import { test } from "vitest";
import TypeText from "@/components/TypeTest/TypeText";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("renders", async () => {
  render(<TypeText />);
  await userEvent.keyboard("a");
});
