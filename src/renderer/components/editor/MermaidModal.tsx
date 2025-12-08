import * as Dialog from '@radix-ui/react-dialog';
import type { MermaidModalProps, MermaidModalState } from '@shared/types/mermaid';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useMermaid } from '@/hooks/useMermaid';

/**
 * Modal dialog for editing Mermaid diagram code
 * Features: live preview, syntax validation, code editor, caption input
 */
export function MermaidModal(props: MermaidModalProps) {
  const { open, onClose, initialCode = '', initialCaption = '', onSave, diagramId } = props;

  const [state, setState] = useState<MermaidModalState>({
    code: initialCode,
    caption: initialCaption,
    validation: { isValid: true, error: null },
    isValidating: false,
    previewKey: 0,
  });

  const previewRef = useRef<HTMLDivElement>(null);
  const { renderDiagram, validateMermaid } = useMermaid();

  // Reset state and trigger validation when modal opens
  useEffect(() => {
    if (open) {
      // Clean up any accumulated mermaid divs when modal opens
      const mermaidDivs = document.querySelectorAll('[id^="dmermaid-"], [id^="mermaid-"]');
      mermaidDivs.forEach((div) => {
        if (div.parentNode === document.body) {
          div.remove();
        }
      });

      if (initialCode.trim()) {
        // Immediately validate the initial code
        const validateInitial = async () => {
          setState((prev) => ({ ...prev, isValidating: true }));
          const validation = await validateMermaid(initialCode);
          setState({
            code: initialCode,
            caption: initialCaption,
            validation,
            isValidating: false,
            previewKey: Date.now(),
          });
        };
        validateInitial();
      } else {
        // Empty code - no validation needed, no error to show
        setState({
          code: initialCode,
          caption: initialCaption,
          validation: { isValid: true, error: null }, // Set to valid when empty
          isValidating: false,
          previewKey: Date.now(),
        });
      }
    }
  }, [open, initialCode, initialCaption, validateMermaid]);

  // Validate when code changes (after initial load)
  useEffect(() => {
    if (!open || !state.code.trim()) {
      return;
    }

    // Skip if this is the initial code (already validated above)
    if (state.code === initialCode) {
      return;
    }

    const debounceTimer = setTimeout(async () => {
      setState((prev: MermaidModalState) => ({ ...prev, isValidating: true }));
      const validation = await validateMermaid(state.code);
      setState((prev: MermaidModalState) => ({
        ...prev,
        validation,
        isValidating: false,
        previewKey: Date.now(),
      }));
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [state.code, open, initialCode, validateMermaid]);

  // Render preview when validation is complete and ref is available
  useEffect(() => {
    if (!state.validation.isValid || !state.code.trim() || state.isValidating) {
      return;
    }

    if (!previewRef.current) {
      return;
    }

    const renderPreview = async () => {
      try {
        console.log('Rendering diagram preview...');
        await renderDiagram(state.code, previewRef.current!);
        console.log('Preview rendered successfully');
      } catch (err) {
        console.error('Preview render error:', err);
      }
    };

    renderPreview();
  }, [state.validation.isValid, state.code, state.isValidating, state.previewKey, renderDiagram]);

  const handleSave = () => {
    if (!state.validation.isValid) return;
    // Just pass the code and caption - let the editor handle PNG generation
    onSave(state.code, state.caption || undefined);
  };

  const handleCancel = () => {
    // Clean up any lingering mermaid error elements in the document
    const mermaidErrors = document.querySelectorAll('[id^="dmermaid-"], [id^="mermaid-"]');
    mermaidErrors.forEach((el) => {
      if (el.parentNode === document.body) {
        el.remove();
      }
    });

    setState({
      code: initialCode,
      caption: '',
      validation: { isValid: true, error: null },
      isValidating: false,
      previewKey: 0,
    });
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          style={{ zIndex: 999998 }}
        />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg"
          style={{ zIndex: 999999 }}
        >
          <Dialog.Title className="mb-4 text-xl font-semibold">
            {diagramId ? 'Edit Diagram' : 'Insert Diagram'}
          </Dialog.Title>

          <div className="grid grid-cols-2 gap-4">
            {/* Left: Code Editor */}
            <div className="flex flex-col">
              <Label htmlFor="mermaid-code" className="mb-2">
                Mermaid Code
              </Label>
              <textarea
                id="mermaid-code"
                className="min-h-[300px] flex-1 rounded border border-gray-300 p-3 font-mono text-sm"
                value={state.code}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setState((prev: MermaidModalState) => ({
                    ...prev,
                    code: e.target.value,
                  }))
                }
                placeholder="graph TD&#10;  A[Start] --> B[End]"
                spellCheck={false}
              />

              <div className="mt-2">
                <Label htmlFor="mermaid-caption" className="mb-2">
                  Caption (optional)
                </Label>
                <Input
                  id="mermaid-caption"
                  value={state.caption}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setState((prev: MermaidModalState) => ({
                      ...prev,
                      caption: e.target.value,
                    }))
                  }
                  placeholder="Diagram description"
                />
              </div>
            </div>

            {/* Right: Live Preview */}
            <div className="flex flex-col">
              <Label className="mb-2">Preview</Label>
              <div
                className="flex-1 overflow-auto rounded border border-gray-300 bg-gray-50 p-4 max-h-[380px]"
                style={{ minHeight: '300px' }}
              >
                {state.isValidating && (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    Validating...
                  </div>
                )}

                {!state.isValidating && !state.validation.isValid && state.validation.error && (
                  <div className="rounded bg-red-50 p-4 text-sm text-red-700">
                    <strong>Syntax Error:</strong>
                    <pre className="mt-2 whitespace-pre-wrap">{state.validation.error}</pre>
                  </div>
                )}

                {!state.isValidating && state.validation.isValid && state.code.trim() && (
                  <div
                    ref={previewRef}
                    key={state.previewKey}
                    className="mermaid-preview flex items-center justify-center"
                    style={{ minHeight: '250px', width: '100%' }}
                  />
                )}

                {!state.code.trim() && (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    Enter Mermaid code to see preview
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!state.validation.isValid || !state.code.trim()}>
              {diagramId ? 'Update' : 'Insert'}
            </Button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
              aria-label="Close"
            >
              ✕
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
