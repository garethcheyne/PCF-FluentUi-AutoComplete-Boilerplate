import * as React from 'react'
import * as moment from 'moment'
import axios from 'axios'
import { useDebounce } from 'usehooks-ts'
import { IInputs } from '../generated/ManifestTypes'
import { EntityDetailResponse, EntityDetailUtils } from '../types/EntityDetailTypes'
import { EntityHoverCard } from './EntityHoverCard'
import { useState, useRef, useEffect, ChangeEvent } from 'react'
import { FocusZone, FocusZoneDirection } from '@fluentui/react/lib/FocusZone'
import { TooltipHost, ITooltipHostStyles } from '@fluentui/react/lib/Tooltip'
import { IIconProps } from '@fluentui/react/lib/Icon'
import { mergeStyleSets, getTheme, getFocusStyle, ITheme } from '@fluentui/react/lib/Styling'
import { ActionButton } from '@fluentui/react/lib/Button'
import { ThemeProvider, SearchBox, Stack, IStackTokens, Icon, FontWeights, DirectionalHint, TooltipDelay, Label } from '@fluentui/react'
import { initializeIcons } from '@fluentui/react/lib/Icons'
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner'

// Initialize icons in case this example uses them
initializeIcons()

// Constants
const DEBOUNCE_DELAY = 500;
const MIN_SEARCH_LENGTH = 3;
const MAX_DROPDOWN_HEIGHT = 420;
const API_PAGE_SIZE = 35;

const stackTokens: Partial<IStackTokens> = { childrenGap: 0 }

// -------- Icons ----------------
const searchIcon: IIconProps =
{
    iconName: 'WorkforceManagement', // Set icon here for search bar.
    styles: {
        root: { color: '#656565' }
    }
};

const dropBtnOne: IIconProps = {
    iconName: 'Zoom', // Set icon here for focusZone left side.
    styles: {
        root: { color: '#656565' }
    }
};
const dropBtnTwo: IIconProps = {
    iconName: 'Zoom', // Set icon here for focusZone right side.
    styles: {
        root: { color: '#656565' }
    }
};

// -------- Icons ----------------

const theme: ITheme = getTheme();

const { palette, semanticColors, fonts } = theme;

const style = mergeStyleSets({
    stackContainer: {
        position: 'relative'
    },
    focusZoneContainer: {
        position: 'absolute',
        marginTop: '2px !important',
        border: `1px solid ${semanticColors.bodyDivider}`,
        boxShadow: '2px 2px 8px rgb(245 ,245, 245);',
        borderRadius: '4px',
        flexGrow: 1,
        zIndex: 9,
    },
    focusZoneContent: {
        overflow: 'hidden',
        backgroundColor: '#fff',
        overflowY: 'scroll',
        msOverflowStyle: 'none',  /* IE and Edge */
        scrollbarWidth: 'none',
        maxHeight: MAX_DROPDOWN_HEIGHT,
        padding: '2px',
        selectors: {
            '&::-webkit-scrollbar': {
                width: '6px',
                height: '20px',
            },
            '&::-webkit-scrollbar-track': {
                background: 'rgba(0,0,0,0)',
            },
            '&::-webkit-scrollbar-thumb': {
                borderRadius: '6px',
                background: 'rgb(245 ,245, 245)',
            },
            '&::-webkit-scrollbar-thumb:hover': {
                width: '8px',
                height: '26px',
                background: 'rgb(245 ,245, 245)',
            }
        }
    },
    focusZoneHeader: {
        backgroundColor: '#FFF',
        display: 'flex',
        height: '32px',
        padding: '2px 2px',
    },
    focusZoneHeaderContent: {
        fontSize: '14px',
        textAlign: 'left',
        padding: '0px 6px',
        top: '50%',
        width: '100%',
        backgroundColor: '#fafaFA',
        borderRadius: '4px',
    },
    focusZoneFooter: {
        backgroundColor: '#FFF',
        borderTop: `1px solid ${palette.neutralTertiary}`,
        position: 'sticky',
        display: 'flex',
        // height: '30px',
        bottom: '0px',
        padding: '8px 10px',
    },
    focusZoneFooterLeft: {
        width: '50%',
        textAlign: 'left'
    },
    focusZoneFooterRight: {
        width: '50%',
        textAlign: 'right'
    },
    focusZoneBtn: {
        fontSize: fonts.small.fontSize,
        borderRadius: '4px',
        padding: '8px 10px',
        color: palette.neutralDark,
        height: 24,
        selectors: {
            '&:hover': {
                backgroundColor: 'rgb(245 ,245, 245)',
                color: palette.neutralDark
            },
        },
    },
    searchBox: {
        backgroundColor: 'rgb(245 ,245, 245)',
        border: 'none',
        borderRadius: '4px',
        padding: '4px',
        transform: 'scaleX(1)',
        selectors: {
            // '&:focus-within': {
            //     border: 'none',
            //     clipPath: 'inset(calc(100% - 2px) 0px 0px)',
            //     borderBottom: '2px solid rgb(15, 108, 189)',
            //     transform: 'scaleX(1)',
            //     transitionDelay: '0ms',
            //     transitionDuration: '200ms',
            // },
            '&::after': {
                border: 'none',
                clipPath: 'inset(calc(100% - 2px) 0px 0px)',
                borderBottom: '2px solid rgb(15, 108, 189)',
                transform: 'scaleX(1)',
                transitionDelay: '2000ms',
                transitionDuration: '2000ms',
                borderRadius: '4px',
            },
        },
    },
    focusZoneWebIcon: {
        display: 'block',
        cursor: 'pointer',
        alignSelf: 'center',
        color: palette.neutralTertiary,
        fontSize: fonts.small.fontSize,
        flexShrink: 0,
        margin: '8px'
    },
    callout: {
        width: 320,
        maxWidth: '90%',
        padding: '20px 24px',
    },
    title: {
        marginBottom: 12,
        fontWeight: FontWeights.semilight,
    },
    link: {
        display: 'block',
        marginTop: 20,
    },
    // CSS for Focus Items
    itemContainer: [

        getFocusStyle(theme, { inset: -1 }),
        {
            minHeight: 32,
            padding: 4,
            boxSizing: 'border-box',
            borderRadius: '4px',
            display: 'flex',
            selectors: {
                '&:hover': { backgroundColor: 'rgb(245 ,245, 245)' },
            },
        },
    ],
    itemContent: {
        padding: '2px',
        overflow: 'hidden',
        flexGrow: 1,
    },

    itemSection: [
        fonts.small,
        {
            textAlign: 'left',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        }
    ],
    itemHeader: [
        fonts.mediumPlus,
        {
            fontWeight: 500,
            fontSize: 14,
            color: '#242424',
            textAlign: 'left',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
    ],
    itemSubHeader: [
        fonts.small,
        {
            fontWeight: 500,
            color: '#242424',
            textAlign: 'left',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        }
    ],
    itemDetail: [
        fonts.small,
        {
            color: '#616161',
            textAlign: 'left',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        }
    ],
    itemImage: {
        padding: 1,
        alignSelf: 'center',
        flexShrink: 0,
    },
    itemIconToolTip: {
        alignSelf: 'center',
        marginLeft: 10,
    }
});




const iconToolTipStyle: Partial<ITooltipHostStyles> = {
    root: {
        display: 'inline-block',
        alignSelf: 'center'
    }
};

// TypeScript interfaces for better type safety
interface TradingName {
    name: string;
}

interface EntityItem {
    nzbn: string;
    entityName: string;
    entityStatusDescription: string;
    registrationDate: string;
    tradingNames?: TradingName[];
}

interface ApiResponse {
    items: EntityItem[];
}

export interface FluentUIAutoCompleteProps {
    context?: ComponentFramework.Context<IInputs>
    apiToken?: string;
    isDisabled?: boolean;
    value?: string;
    updateValue: (value: any) => void;
}


export const FluentUIAutoComplete: React.FC<FluentUIAutoCompleteProps> = (props) => {
    const [focusWidth, setFocusWidth] = useState<number>(0);
    const getInputWidth = () => {
        let w = searchboxRef?.current?.offsetWidth;
        if (typeof w === 'number') {
            w = w - 2;
            if (focusWidth !== w) {
                setFocusWidth(w);
            }
        }
    };

    const [value, setValue] = useState<string>(props.value || '');
    const [suggestions, setSuggestions] = useState<EntityItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hoveredItem, setHoveredItem] = useState<EntityItem | null>(null);
    const [hoverDetails, setHoverDetails] = useState<EntityDetailResponse | null>(null);
    const [isLoadingHover, setIsLoadingHover] = useState<boolean>(false);
    const isSelected = useRef<boolean>(true);
    const searchboxRef = useRef<HTMLDivElement>(null);
    const hoverTimeoutRef = useRef<number | null>(null);
    const debouncedValue = useDebounce<string>(value, DEBOUNCE_DELAY);

    const handleSearch = (evt: ChangeEvent<HTMLInputElement> | undefined) => {
        if (evt !== undefined) {
            setIsLoading(true);
            isSelected.current = false;
            setValue(evt.target.value);
        }
    };

    useEffect(() => {
        async function fetchSuggestions() {
            try {
                const uri = `https://api.business.govt.nz/gateway/nzbn/v5/entities?page-size=${API_PAGE_SIZE}&search-term=${encodeURI(
                    debouncedValue.toLocaleLowerCase()
                )}`;

                const response = await axios.get<ApiResponse>(uri, {
                    headers: {
                        'Ocp-Apim-Subscription-Key': `${props.apiToken}`,
                        'Cache-Control': 'no-cache',
                    },
                });

                if (response.status === 200) {
                    console.log('API Response:', response.data.items);
                    setIsLoading(false);
                    setSuggestions(response.data.items);
                }
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setIsLoading(false);
                setSuggestions([]);
            }
        }

        if (isSelected.current === false && debouncedValue.length > MIN_SEARCH_LENGTH) {
            console.log('Fetching suggestions for:', debouncedValue);
            setIsLoading(true);
            setSuggestions([]);
            fetchSuggestions();
        } else {
            console.log('Not fetching - isSelected:', isSelected.current, 'length:', debouncedValue.length);
            setIsLoading(false);
            setSuggestions([]);
        }

        getInputWidth();
    }, [debouncedValue, props.apiToken]);

    const onClear = () => {
        setValue('');
        setSuggestions([]);
        props.updateValue('');
    };

    const onSelect = (item: EntityItem) => {
        if (item !== null && item !== undefined) {
            isSelected.current = true;
            setValue(item.entityName);
            getDetail(item.nzbn);
        }
    };

    const onItemHover = async (item: EntityItem) => {
        // Clear any existing timeout
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }

        // Set a delay before making the API call
        hoverTimeoutRef.current = window.setTimeout(async () => {
            if (hoveredItem?.nzbn === item.nzbn && hoverDetails) return; // Already have details for this item

            setHoveredItem(item);
            setIsLoadingHover(true);
            setHoverDetails(null);

            try {
                const uri = `https://api.business.govt.nz/gateway/nzbn/v5/entities/${item.nzbn}`;
                const response = await axios.get<EntityDetailResponse>(uri, {
                    headers: {
                        'Ocp-Apim-Subscription-Key': `${props.apiToken}`,
                        'Cache-Control': 'no-cache',
                    },
                });

                if (response.status === 200) {
                    setHoverDetails(response.data);
                }
            } catch (error) {
                console.error('Error fetching hover details:', error);
            } finally {
                setIsLoadingHover(false);
            }
        }, 500); // Increased delay to 500ms for better UX
    };

    const onItemHoverLeave = () => {
        // Clear the timeout if user leaves before delay
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }

        // Don't immediately hide the card - let the callout handle its own dismiss logic
        // The callout will dismiss when mouse leaves both the target and the callout itself
    };

    const onCalloutDismiss = () => {
        setHoveredItem(null);
        setHoverDetails(null);
        setIsLoadingHover(false);
    };

    const openWebsite = (url: string) => {
        window.open(url, '_blank');
    };

    const spinner = (): React.ReactElement => {
        return (
            <div className={style.focusZoneHeaderContent}>
                <Spinner size={SpinnerSize.large} labelPosition="left" label="Waiting on results..." />
            </div>
        );
    };

    const renderHoverCard = (): React.ReactElement | null => {
        return (
            <EntityHoverCard
                targetId={`suggestion_${suggestions.findIndex(s => s.nzbn === hoveredItem?.nzbn)}`}
                hoveredItem={hoveredItem}
                hoverDetails={hoverDetails}
                isLoadingHover={isLoadingHover}
                onDismiss={onCalloutDismiss}
            />
        );
    };

    const renderDropdown = (item: EntityItem, index: number): React.ReactElement => {
        const url = `https://www.nzbn.govt.nz/mynzbn/nzbndetails/${item.nzbn}`;
        return (
            <div
                id={`suggestion_${index}`}
                key={`key_${index}`}
                className={style.itemContainer}
                data-is-focusable={true}
                onClick={() => onSelect(item)}
                onMouseEnter={() => onItemHover(item)}
            >
                <div className={style.itemContent}>
                    <div className={style.itemHeader}>{item.entityName}</div>
                    <div className={style.itemDetail}>{`NZBN#  ${item.nzbn} `}</div>
                    <div className={style.itemDetail}>{`Status: ${item.entityStatusDescription}`}</div>

                    {item.tradingNames && item.tradingNames.length > 0 && (
                        <div className={style.itemSection}>{`Trading Names`}</div>
                    )}

                    {item.tradingNames && item.tradingNames.length > 0 &&
                        item.tradingNames.map((tradingName: TradingName, tradingIndex: number) => (
                            <div key={`trading-${index}-${tradingIndex}`} className={style.itemDetail}>{` - ${tradingName.name}`}</div>
                        ))}
                </div>

                <TooltipHost
                    content="Click to view on the NZBN Website"
                    styles={iconToolTipStyle}
                    delay={TooltipDelay.medium}
                    id={`tooltip-${index}`}
                    directionalHint={DirectionalHint.bottomCenter}
                >
                    <Icon
                        aria-describedby={`tooltip-${index}`}
                        key={`link-${item.nzbn}`}
                        className={style.focusZoneWebIcon}
                        onClick={() => openWebsite(url)}
                        iconName={'Globe'}
                    ></Icon>
                </TooltipHost>
            </div>
        );
    };

    const getDetail = (nzbn: string) => {
        const uri = `https://api.business.govt.nz/gateway/nzbn/v5/entities/${nzbn}`;

        axios
            .get<EntityDetailResponse>(uri, {
                headers: {
                    'Ocp-Apim-Subscription-Key': `${props.apiToken}`,
                    'Cache-Control': 'no-cache',
                },
            })
            .then(
                (response) => {
                    setSuggestions([]);
                    props.updateValue(response.data);
                }
            )
            .catch((err) => {
                console.error(err.message);
            });
    };

    return (
        <div>
            <div ref={searchboxRef}>
                <ThemeProvider>
                    <Stack tokens={stackTokens} className={style.stackContainer}>
                        <SearchBox
                            placeholder="---"
                            value={value}
                            onChange={handleSearch}
                            iconProps={searchIcon}
                            onClear={onClear}
                            disabled={props.isDisabled}
                            className={style.searchBox}
                        ></SearchBox>
                    </Stack>
                </ThemeProvider>
            </div>

            {(suggestions.length > 0 || isLoading) && (
                <FocusZone direction={FocusZoneDirection.vertical} className={style.focusZoneContainer} style={{ width: focusWidth }}>
                    <div className={style.focusZoneHeader}>
                        {!isLoading && (
                            <div className={style.focusZoneHeaderContent}>
                                <Label>Search Results</Label>
                            </div>
                        )}

                        {isLoading && spinner()}
                    </div>

                    <div className={style.focusZoneContent} data-is-scrollable>
                        {!isLoading &&
                            suggestions.map((suggestion, i) => renderDropdown(suggestion, i))}
                    </div>



                    <div className={style.focusZoneFooter}>
                        <div className={style.focusZoneFooterLeft}>
                            <ActionButton
                                className={style.focusZoneBtn}
                                iconProps={dropBtnOne}
                                href={`https://www.nzbn.govt.nz/mynzbn/search/${encodeURI(value)}/`}
                                target="_blank"
                            >
                                <Label>NZBN Website</Label>
                            </ActionButton>
                        </div>

                        <div className={style.focusZoneFooterRight}>
                            <ActionButton
                                className={style.focusZoneBtn}
                                iconProps={dropBtnTwo}
                                href={`https://app.companiesoffice.govt.nz/companies/app/ui/pages/companies/search?q=${encodeURI(
                                    value
                                )}&entityTypes=ALL&entityStatusGroups=ALL&incorpFrom=&incorpTo=&addressTypes=ALL&addressKeyword=&start=0&limit=15&sf=&sd=&advancedPanel=false&mode=standard#results`}
                                target="_blank"
                            >
                                <Label>Companies Website</Label>
                            </ActionButton>
                        </div>
                    </div>
                </FocusZone>
            )}

            {renderHoverCard()}
        </div>
    );
};
