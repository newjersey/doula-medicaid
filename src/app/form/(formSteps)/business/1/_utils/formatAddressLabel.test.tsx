import { formatAddressLabel } from "@/app/form/(formSteps)/business/1/_utils/formatAddressLabel";
import { AddressState } from "@/app/form/_utils/inputFields/addressState";
import { render, screen } from "@testing-library/react";

describe("formatAddressLabel", () => {
  it("includes address line 2 when present", () => {
    render(formatAddressLabel("123 Main St", "Apt 4B", "Trenton", AddressState.NJ, "10001"));
    screen.getByText("123 Main St");
    screen.getByText("Apt 4B");
    screen.getByText("Trenton, NJ 10001");
  });

  it("omits address line 2 when not present", () => {
    const { container } = render(
      formatAddressLabel("123 Main St", null, "Trenton", AddressState.NJ, "10001"),
    );
    expect(container).toHaveTextContent("123 Main StTrenton, NJ 10001");
  });
});
