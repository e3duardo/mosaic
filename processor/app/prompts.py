import os

DEFAULT_EXAMPLES = """\"Gastei 50 reais no tempero\" -> {"category":"financial","artifacts":{"expense":{"amount":50,"description":"tempero","account":"main"}}}
"Tomei um noex e um seretide" -> {"category":"medical","artifacts":{"medicine":{"name":"noex e seretide","quantity":1,"taken_at":"now"}}}
"Tomei um Noex a 15 minutos" -> {"category":"medical","artifacts":{"medicine":{"name":"Noex","quantity":1,"taken_at":"15 minutes ago"}}}
"Tomei um Noex agora" -> {"category":"medical","artifacts":{"medicine":{"name":"Noex","quantity":1,"taken_at":"now"}}}
"Tive uma ideia de criar xxx" -> {"category":"ideas","artifacts":{"idea":{"content":"criar xxx"}}}"""


def _load_examples() -> str:
    base = os.path.dirname(os.path.abspath(__file__))
    path = os.path.join(base, "examples.txt")
    try:
        with open(path, encoding="utf-8") as f:
            content = f.read().strip()
            return content if content else DEFAULT_EXAMPLES
    except OSError:
        return DEFAULT_EXAMPLES


def build_system_prompt(
    known_medications: list[str] | None = None,
    category_hint: str = "",
) -> str:
    med_hint = ""
    if known_medications:
        med_hint = f"\n\nKnown medications (if the message mentions any of these, it is always medical): {', '.join(known_medications)}"
    cat_hint = ""
    if category_hint:
        cat_hint = f"\n\nIMPORTANT: The user confirmed this message is category '{category_hint}'. Use that category and extract the appropriate artifacts."
    examples = _load_examples()
    return f"""You are a categorizer for a personal assistant. The user writes messages in natural language (Portuguese or English).

For each message, determine the category and extract structured artifacts.{med_hint}{cat_hint}

Categories:
- financial: expenses (gastos, despesas) or earnings (ganhos, receitas)
- medical: medicines taken or doctor appointments
- ideas: ideas the user had
- remember: things to remember
- message_only: none of the above, just store the message

Return valid JSON with:
- category: one of the above
- artifacts: object or array with extracted data. For financial use {{expense: {{amount, description, account}}}} or {{earning: {{...}}}}. For medical use {{medicine: {{name, quantity, taken_at}}}} or {{appointment: {{...}}}}. For ideas use {{idea: {{content}}}}. For remember use {{reminder: {{content, due_at}}}}.

Examples:
{examples}

Important: Any message about taking medicine (tomei, tomei um, tomei uma, etc.) is always medical, never message_only.
If unclear, use message_only with empty artifacts."""


# Fallback when no medications provided
SYSTEM_PROMPT = build_system_prompt(None, "")
