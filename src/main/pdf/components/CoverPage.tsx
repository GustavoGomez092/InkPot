/**
 * Cover Page Component for PDF
 * Renders a cover page with title, subtitle, author, logo, and background
 */

import { Image, Page, Text, View } from '@react-pdf/renderer';
import type { ThemeData } from '@shared/types/ipc-contracts.js';
import type React from 'react';

export interface CoverPageProps {
  title?: string | null;
  subtitle?: string | null;
  author?: string | null;
  logoPath?: string | null;
  backgroundPath?: string | null;
  theme: ThemeData;
}

/**
 * Cover page component for PDF documents
 */
export const CoverPage: React.FC<CoverPageProps> = ({
  title,
  subtitle,
  author,
  logoPath,
  backgroundPath,
  theme,
}) => {
  // Background image should be full bleed (no padding)
  const hasBackground = !!backgroundPath;

  return (
    <Page
      size={{
        width: theme.pageWidth * 72,
        height: theme.pageHeight * 72,
      }}
      style={{
        backgroundColor: theme.backgroundColor,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // No padding when background image exists (full bleed)
        // Otherwise use theme margins
        paddingTop: hasBackground ? 0 : theme.marginTop * 72,
        paddingBottom: hasBackground ? 0 : theme.marginBottom * 72,
        paddingLeft: hasBackground ? 0 : theme.marginLeft * 72,
        paddingRight: hasBackground ? 0 : theme.marginRight * 72,
      }}
    >
      {/* Background Image - Full Bleed */}
      {backgroundPath && (
        <Image
          src={backgroundPath}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}

      {/* Content Container with padding when background exists */}
      <View
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          // Add padding back for content when background is full bleed
          paddingTop: hasBackground ? theme.marginTop * 72 : 0,
          paddingBottom: hasBackground ? theme.marginBottom * 72 : 0,
          paddingLeft: hasBackground ? theme.marginLeft * 72 : 0,
          paddingRight: hasBackground ? theme.marginRight * 72 : 0,
        }}
      >
        {/* Logo - First element */}
        {logoPath && (
          <View style={{ marginBottom: 40 }}>
            <Image
              src={logoPath}
              style={{
                maxWidth: 200,
                maxHeight: 100,
                objectFit: 'contain',
              }}
            />
          </View>
        )}

        {/* Title */}
        {title && (
          <Text
            style={{
              fontFamily: theme.headingFont,
              fontSize: theme.h1Size * 1.5,
              color: theme.headingColor,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 20,
              maxWidth: '80%',
            }}
          >
            {title}
          </Text>
        )}

        {/* Subtitle */}
        {subtitle && (
          <Text
            style={{
              fontFamily: theme.bodyFont,
              fontSize: theme.h3Size,
              color: theme.textColor,
              textAlign: 'center',
              marginBottom: 30,
              maxWidth: '70%',
            }}
          >
            {subtitle}
          </Text>
        )}

        {/* Author */}
        {author && (
          <Text
            style={{
              fontFamily: theme.bodyFont,
              fontSize: theme.bodySize * 1.2,
              color: theme.textColor,
              textAlign: 'center',
              fontStyle: 'italic',
            }}
          >
            {author}
          </Text>
        )}
      </View>
    </Page>
  );
};
