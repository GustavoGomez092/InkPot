import Sidebar from '../components/Sidebar';
import { Card, CardContent } from '../components/ui';

interface FeatureSection {
  title: string;
  icon: React.ReactNode;
  features: {
    name: string;
    description: string;
  }[];
}

function HelpView() {
  const featureSections: FeatureSection[] = [
    {
      title: 'Project Management',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      features: [
        {
          name: 'Create New Documents',
          description:
            'Start new writing projects with customizable names, descriptions, and themes. Projects are automatically saved to your InkPot projects folder.',
        },
        {
          name: 'Recent Projects View',
          description:
            'Access all your recent documents from the home screen. See project titles, descriptions, and last modified dates at a glance.',
        },
        {
          name: 'Project Search',
          description:
            'Quickly find projects using the search bar. Filter by project name to locate documents instantly.',
        },
        {
          name: 'Project Deletion',
          description:
            'Delete projects you no longer need. Hover over project cards to reveal the delete button, which removes both the database entry and project file.',
        },
      ],
    },
    {
      title: 'Document Editing',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
      features: [
        {
          name: 'Rich Text Editor',
          description:
            'Write with a powerful Tiptap-based editor supporting headers, bold, italic, underline, strikethrough, code blocks, and more.',
        },
        {
          name: 'Content & Cover Modes',
          description:
            'Toggle between content editing mode for your manuscript and cover page mode for designing your document cover.',
        },
        {
          name: 'Cover Page Designer',
          description:
            'Create professional cover pages with customizable titles, subtitles, author names, and dates. Choose from various text alignment options.',
        },
        {
          name: 'Formatting Toolbar',
          description:
            'Access all formatting options through an intuitive toolbar including text styles, alignment, lists, and block types.',
        },
      ],
    },
    {
      title: 'Theme & Typography',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      ),
      features: [
        {
          name: 'Theme Management',
          description:
            'Create, edit, and manage custom themes for your PDF exports. Built-in themes include Classic, Modern, and Elegant styles.',
        },
        {
          name: 'Font Selection',
          description:
            'Choose from a curated library of Google Fonts for both headings and body text. Fonts are automatically downloaded and cached.',
        },
        {
          name: 'Typography Customization',
          description:
            'Fine-tune font sizes for all heading levels (H1-H6) and body text. Adjust letter spacing and line height for perfect readability.',
        },
        {
          name: 'Color Customization',
          description:
            'Customize text color, background color, link color, and code block backgrounds to match your aesthetic preferences.',
        },
      ],
    },
    {
      title: 'Page Layout',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"
          />
        </svg>
      ),
      features: [
        {
          name: 'Page Dimensions',
          description:
            'Configure page width and height in inches to match standard paper sizes or create custom dimensions for your exports.',
        },
        {
          name: 'Margin Control',
          description:
            'Set individual margins (top, bottom, left, right) to control the spacing around your content for professional layouts.',
        },
        {
          name: 'Live Preview',
          description:
            'See a real-time preview of your theme settings with sample content before applying them to your documents.',
        },
      ],
    },
    {
      title: 'PDF Export',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      features: [
        {
          name: 'Export to PDF',
          description:
            'Generate professional PDF documents from your manuscripts with a single click. PDFs use your selected theme settings.',
        },
        {
          name: 'Cover Page Integration',
          description:
            'Automatically include your custom cover page design as the first page of your PDF export.',
        },
        {
          name: 'Theme-Based Styling',
          description:
            'PDF exports apply your active theme, including fonts, colors, typography settings, and page layout configurations.',
        },
      ],
    },
    {
      title: 'Data Management',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
          />
        </svg>
      ),
      features: [
        {
          name: 'Automatic Saving',
          description:
            'Your work is automatically saved as you type. Projects are stored in a local SQLite database with file-based backups.',
        },
        {
          name: 'Project Metadata',
          description:
            'Track project creation dates, last modified times, and other metadata to stay organized.',
        },
        {
          name: 'Theme Persistence',
          description:
            'Custom themes are saved to the database and can be reused across multiple projects.',
        },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar activePage="help" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-8 py-8 border-b max-h-32 border-border">
          <h2 className="text-3xl font-bold text-foreground mb-2">Help & Features</h2>
          <p className="text-sm text-muted-foreground">
            Learn about everything InkPot can do for your writing projects
          </p>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Introduction */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary shrink-0">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Welcome to InkPot
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      InkPot is a powerful writing application designed for authors, content
                      creators, and anyone who wants to write beautifully formatted documents. With
                      advanced typography controls, customizable themes, and professional PDF export
                      capabilities, InkPot makes it easy to create stunning manuscripts, articles,
                      and books.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature Sections */}
            {featureSections.map((section, index) => (
              <div key={index}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-accent text-accent-foreground rounded-lg">{section.icon}</div>
                  <h3 className="text-2xl font-bold text-foreground">{section.title}</h3>
                </div>

                <div className="grid gap-4">
                  {section.features.map((feature, featureIndex) => (
                    <Card key={featureIndex}>
                      <CardContent className="p-5">
                        <h4 className="text-lg font-semibold text-foreground mb-2">
                          {feature.name}
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}

            {/* Getting Started */}
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary shrink-0">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Getting Started
                    </h3>
                    <ol className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-primary shrink-0">1.</span>
                        <span>
                          Click <strong>"New Document"</strong> in the sidebar to create your first
                          project
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-primary shrink-0">2.</span>
                        <span>
                          Give your project a name and optional description, then select a theme
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-primary shrink-0">3.</span>
                        <span>Start writing in the rich text editor with full formatting support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-primary shrink-0">4.</span>
                        <span>
                          Switch to <strong>"Cover"</strong> mode to design your cover page
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-primary shrink-0">5.</span>
                        <span>
                          Visit <strong>Settings</strong> to customize themes, fonts, and typography
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-primary shrink-0">6.</span>
                        <span>
                          Export your finished document to PDF when you're ready to share
                        </span>
                      </li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips & Tricks */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent text-accent-foreground rounded-lg shrink-0">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Tips & Tricks</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary shrink-0">•</span>
                        <span>
                          <strong>Theme Preview:</strong> Use the live preview in Settings to see how
                          your theme changes affect document appearance before saving
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary shrink-0">•</span>
                        <span>
                          <strong>Font Loading:</strong> The first time you use a Google Font, it
                          will be downloaded. Subsequent uses will load instantly from cache
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary shrink-0">•</span>
                        <span>
                          <strong>Active Theme:</strong> Set a theme as active in Settings to use it
                          as the default for new projects and PDF exports
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary shrink-0">•</span>
                        <span>
                          <strong>Custom Themes:</strong> Create multiple custom themes for different
                          types of documents (manuscripts, articles, reports, etc.)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary shrink-0">•</span>
                        <span>
                          <strong>Keyboard Shortcuts:</strong> Use standard formatting shortcuts in
                          the editor (Cmd/Ctrl+B for bold, Cmd/Ctrl+I for italic, etc.)
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="border-accent">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent text-accent-foreground rounded-lg shrink-0">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Need More Help?</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      If you have questions or need assistance, we're here to help.
                    </p>
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        <strong className="text-foreground">Version:</strong> 1.0.0
                      </p>
                      <p className="text-muted-foreground">
                        <strong className="text-foreground">Platform:</strong> Electron Desktop App
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HelpView;
