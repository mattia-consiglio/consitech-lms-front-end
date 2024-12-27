import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import PasswordInput from "../PasswordInput"

describe("PasswordInput", () => {
	const mockSetPassword = jest.fn()

	it("renders password input with toggle visibility button", () => {
		render(
			<PasswordInput
				password=""
				setPassword={mockSetPassword}
				showPlaceholder={true}
			/>,
		)
		expect(screen.getByPlaceholderText("Password")).toBeInTheDocument()
		expect(
			screen.getByRole("button", { name: "Mostra password" }),
		).toBeInTheDocument()
	})

	it("toggles password visibility when button is clicked", () => {
		render(
			<PasswordInput
				password=""
				setPassword={mockSetPassword}
				showPlaceholder={true}
			/>,
		)
		const passwordInput =
			screen.getByPlaceholderText<HTMLInputElement>("Password")
		expect(passwordInput).toBeInTheDocument()
		const toggleButton = screen.getByTestId("password-visibility-toggle")
		console.log("label", toggleButton)

		expect(passwordInput.type).toBe("password")
		expect(toggleButton).toHaveAttribute("aria-label", "Mostra password")
		fireEvent.click(toggleButton)
		expect(passwordInput.type).toBe("text")
		expect(toggleButton).toHaveAttribute("aria-label", "Nascondi password")

		fireEvent.click(toggleButton)
		expect(passwordInput.type).toBe("password")
		expect(toggleButton).toHaveAttribute("aria-label", "Mostra password")
	})

	it("updates password value when input changes", () => {
		render(
			<PasswordInput
				password=""
				setPassword={mockSetPassword}
				showPlaceholder={true}
			/>,
		)
		const passwordInput =
			screen.getByPlaceholderText<HTMLInputElement>("Password")
		expect(passwordInput).toBeInTheDocument()
		fireEvent.change(passwordInput, { target: { value: "newpassword" } })
		expect(mockSetPassword).toHaveBeenCalledWith("newpassword")
	})

	// it("applies custom className when provided", () => {
	// 	render(<PasswordInput password="" setPassword={mockSetPassword} className="custom-class" />)
	// 	const passwordInput = screen.getByLabelText("Password")
	// 	expect(passwordInput).toHaveClass("custom-class")
	// })

	// it("passes additional props to the input element", () => {
	// 	render(<PasswordInput password="" setPassword={mockSetPassword} data-testid="password-input" />)
	// 	expect(screen.getByTestId("password-input")).toBeInTheDocument()
	// })
})
