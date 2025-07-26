import * as React from 'react';
import * as moment from 'moment';
import { Callout } from '@fluentui/react/lib/Callout';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { DirectionalHint, Icon } from '@fluentui/react';
import { mergeStyleSets, getTheme } from '@fluentui/react/lib/Styling';
import { EntityDetailResponse } from '../types/EntityDetailTypes';

const theme = getTheme();
const { palette, semanticColors } = theme;

const styles = mergeStyleSets({
    hoverCard: {
        width: 380,
        maxWidth: '100%',
        backgroundColor: '#fff',
        border: `1px solid ${semanticColors.bodyDivider}`,
        borderRadius: '4px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
        overflow: 'hidden',
        fontFamily: 'Segoe UI, sans-serif',
    },
    cardHeader: {
        padding: '20px 24px 16px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e1e1e1',
    },
    headerContent: {
        // Remove position and z-index since we're simplifying
    },
    entityName: {
        fontSize: '18px',
        fontWeight: 600,
        margin: 0,
        marginBottom: '8px',
        lineHeight: '1.3',
        color: '#323130',
    },
    nzbnBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: '#f3f2f1',
        color: '#323130',
        padding: '4px 12px',
        borderRadius: '16px',
        fontSize: '11px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        gap: '6px',
        border: '1px solid #e1e1e1',
        selectors: {
            '& i': {
                color: palette.themePrimary,
            },
        },
    },
    cardBody: {
        padding: '24px',
        background: '#fff',
    },
    statusRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        padding: '12px 16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
    },
    statusBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 600,
        gap: '6px',
        textTransform: 'capitalize',
        // Dynamic background based on status
        backgroundColor: '#e8f5e8',
        color: '#2d7d32',
        border: '1px solid #c8e6c9',
    },
    dateInfo: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '12px',
        color: '#666',
        gap: '4px',
    },
    infoSection: {
        marginBottom: '20px',
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
        fontWeight: 600,
        color: '#333',
        marginBottom: '12px',
        gap: '8px',
        paddingBottom: '8px',
        borderBottom: '2px solid #f0f0f0',
    },
    sectionIcon: {
        fontSize: '16px',
        color: palette.themePrimary,
    },
    addressItem: {
        display: 'flex',
        alignItems: 'flex-start',
        padding: '8px 12px',
        marginBottom: '8px',
        backgroundColor: '#fafbfc',
        borderRadius: '6px',
        borderLeft: `3px solid ${palette.themePrimary}`,
        fontSize: '12px',
        lineHeight: '1.4',
        gap: '8px',
    },
    addressType: {
        minWidth: '60px',
        fontWeight: 600,
        color: palette.themePrimary,
        textTransform: 'uppercase',
        fontSize: '10px',
        letterSpacing: '0.5px',
    },
    addressText: {
        color: '#555',
        flex: 1,
    },
    tradingNameItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '6px 12px',
        marginBottom: '4px',
        backgroundColor: '#fff5f5',
        borderRadius: '20px',
        border: '1px solid #ffe0e0',
        fontSize: '12px',
        color: '#666',
        gap: '8px',
    },
    tradingIcon: {
        fontSize: '12px',
        color: '#ff6b6b',
    },
    moreIndicator: {
        fontSize: '11px',
        color: '#999',
        fontStyle: 'italic',
        textAlign: 'center',
        padding: '4px',
    },
    cardFooter: {
        padding: '16px 24px',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e9ecef',
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
    },
    actionLink: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 600,
        textDecoration: 'none',
        gap: '6px',
        transition: 'all 0.2s ease',
        border: '1px solid transparent',
        cursor: 'pointer',
    },
    primaryLink: {
        backgroundColor: palette.themePrimary,
        color: '#fff',
        selectors: {
            '&:hover': {
                backgroundColor: palette.themeDark,
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                textDecoration: 'none',
                color: '#fff',
            },
        },
    },
    secondaryLink: {
        backgroundColor: '#fff',
        color: palette.themePrimary,
        border: `1px solid ${palette.themePrimary}`,
        selectors: {
            '&:hover': {
                backgroundColor: palette.themePrimary,
                color: '#fff',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                textDecoration: 'none',
            },
        },
    },
    loadingContainer: {
        textAlign: 'center',
        padding: '40px 24px',
        background: '#fff',
    },
    loadingText: {
        marginTop: '16px',
        fontSize: '14px',
        color: '#666',
        fontWeight: 500,
    },
    noDataContainer: {
        textAlign: 'center',
        padding: '40px 24px',
        background: '#fff',
        color: '#999',
    },
    noDataIcon: {
        fontSize: '32px',
        marginBottom: '12px',
        color: '#ddd',
    },
    entityTypeText: {
        fontSize: '13px',
        color: '#666',
        padding: '4px 0',
    },
});

interface EntityItem {
    nzbn: string;
    entityName: string;
    entityStatusDescription: string;
    registrationDate: string;
}

interface EntityHoverCardProps {
    targetId: string;
    hoveredItem: EntityItem | null;
    hoverDetails: EntityDetailResponse | null;
    isLoadingHover: boolean;
    onDismiss: () => void;
}

export const EntityHoverCard: React.FC<EntityHoverCardProps> = ({
    targetId,
    hoveredItem,
    hoverDetails,
    isLoadingHover,
    onDismiss
}) => {
    if (!hoveredItem) return null;

    return (
        <Callout
            target={`#${targetId}`}
            onDismiss={onDismiss}
            directionalHint={DirectionalHint.rightCenter}
            isBeakVisible={true}
            gapSpace={8}
            dismissOnTargetClick={false}
            preventDismissOnLostFocus={true}
            preventDismissOnScroll={true}
            preventDismissOnResize={false}
        >
            <div className={styles.hoverCard}>
                {isLoadingHover ? (
                    <div className={styles.loadingContainer}>
                        <Spinner size={SpinnerSize.medium} />
                        <div className={styles.loadingText}>Loading entity details...</div>
                    </div>
                ) : hoverDetails ? (
                    <>
                        {/* Header */}
                        <div className={styles.cardHeader}>
                            <div className={styles.headerContent}>
                                <h3 className={styles.entityName}>{hoverDetails.entityName}</h3>
                                <div className={styles.nzbnBadge}>
                                    <Icon iconName="CertifiedDatabase" />
                                    NZBN {hoverDetails.nzbn}
                                </div>
                            </div>
                        </div>

                        {/* Body content */}
                        <div className={styles.cardBody}>
                            {/* Status and registration info */}
                            <div className={styles.statusRow}>
                                <div className={styles.statusBadge}>
                                    <Icon iconName="CheckMark" />
                                    {hoverDetails.entityStatusDescription}
                                </div>
                                <div className={styles.dateInfo}>
                                    <Icon iconName="Calendar" />
                                    {moment(hoverDetails.registrationDate).format('DD MMM YYYY')}
                                </div>
                            </div>

                            {/* Entity Type */}
                            {hoverDetails.entityTypeDescription && (
                                <div className={styles.infoSection}>
                                    <div className={styles.sectionTitle}>
                                        <Icon iconName="BuildingOffice" className={styles.sectionIcon} />
                                        Entity Type
                                    </div>
                                    <div className={styles.entityTypeText}>
                                        {hoverDetails.entityTypeDescription}
                                    </div>
                                </div>
                            )}

                            {/* Addresses */}
                            {hoverDetails.addresses && hoverDetails.addresses.addressList.length > 0 && (
                                <div className={styles.infoSection}>
                                    <div className={styles.sectionTitle}>
                                        <Icon iconName="MapPin" className={styles.sectionIcon} />
                                        Addresses
                                    </div>
                                    {hoverDetails.addresses.addressList.slice(0, 2).map((address, index: number) => (
                                        <div key={index} className={styles.addressItem}>
                                            <div className={styles.addressType}>{address.addressType}</div>
                                            <div className={styles.addressText}>
                                                {address.address1}
                                                {address.address2 && `, ${address.address2}`}
                                                {address.address3 && `, ${address.address3}`}
                                                {address.postCode && ` ${address.postCode}`}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Trading Names */}
                            {hoverDetails.tradingNames && hoverDetails.tradingNames.length > 0 && (
                                <div className={styles.infoSection}>
                                    <div className={styles.sectionTitle}>
                                        <Icon iconName="Tag" className={styles.sectionIcon} />
                                        Trading Names
                                    </div>
                                    {hoverDetails.tradingNames.slice(0, 3).map((tradingName, index: number) => (
                                        <div key={index} className={styles.tradingNameItem}>
                                            <Icon iconName="Store" className={styles.tradingIcon} />
                                            {tradingName.name}
                                        </div>
                                    ))}
                                    {hoverDetails.tradingNames.length > 3 && (
                                        <div className={styles.moreIndicator}>
                                            +{hoverDetails.tradingNames.length - 3} more trading names
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer with action buttons */}
                        <div className={styles.cardFooter}>
                            <a
                                href={`https://www.nzbn.govt.nz/mynzbn/nzbndetails/${hoverDetails.nzbn}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${styles.actionLink} ${styles.primaryLink}`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Icon iconName="Globe" />
                                View on NZBN
                            </a>
                            <a
                                href={`https://app.companiesoffice.govt.nz/companies/app/ui/pages/companies/search?q=${encodeURI(hoverDetails.entityName)}&entityTypes=ALL&entityStatusGroups=ALL&incorpFrom=&incorpTo=&addressTypes=ALL&addressKeyword=&start=0&limit=15&sf=&sd=&advancedPanel=false&mode=standard#results`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${styles.actionLink} ${styles.secondaryLink}`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Icon iconName="Search" />
                                Companies Office
                            </a>
                        </div>
                    </>
                ) : (
                    <div className={styles.noDataContainer}>
                        <Icon iconName="InfoSolid" className={styles.noDataIcon} />
                        <div>No additional details available</div>
                    </div>
                )}
            </div>
        </Callout>
    );
};
