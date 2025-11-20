"use client";

import type { AnyFieldApi } from "@tanstack/react-form";

export function FieldError({ field }: { field: AnyFieldApi }) {
	return (
		<>
			{field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
				<em className="text-red-600 text-sm">
					{field.state.meta.errors.join(", ")}
				</em>
			) : null}
		</>
	);
}
