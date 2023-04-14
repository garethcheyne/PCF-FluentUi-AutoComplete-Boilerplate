import * as React from 'react';
import * as moment from 'moment';
import axios from 'axios';
import { useDebounce, useIsFirstRender, useIsMounted } from 'usehooks-ts';
import { IInputs } from "../generated/ManifestTypes";
import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { FocusZone, FocusZoneDirection } from '@fluentui/react/lib/FocusZone';
import { TooltipHost, ITooltipHostStyles } from '@fluentui/react/lib/Tooltip';
import { IIconProps } from '@fluentui/react/lib/Icon';
import { mergeStyleSets, getTheme, getFocusStyle, ITheme } from '@fluentui/react/lib/Styling';
import { ActionButton } from '@fluentui/react/lib/Button';
import { ThemeProvider, SearchBox, Stack, IStackTokens, Icon, FontWeights, DirectionalHint, TooltipDelay, Label } from '@fluentui/react';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';

// Initialize icons in case this example uses them
initializeIcons();

const stackTokens: Partial<IStackTokens> = { childrenGap: 0 };

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
        maxHeight: 420,
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
            //     clipPath: 'inset(cals(100% - 2px) 0px 0px)',
            //     borderBottom: '2px solid rgb(15, 108, 189)',
            //     transform: 'scaleX(1)',
            //     transitionDelay: '0ms',
            //     transitionDuration: '200ms',
            // },
            '&::after': {
                border: 'none',
                clipPath: 'inset(cals(100% - 2px) 0px 0px)',
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
    // CSS for Focurs Items
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
            textAlign: 'Left',
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

export interface FluentUIAutoCompleteProps {
    context?: ComponentFramework.Context<IInputs>
    apiToken?: string;
    isDisabled?: boolean;
    value?: string;
    updateValue: (value: any) => void;
}



export const FluentUIAutoComplete: React.FunctionComponent<FluentUIAutoCompleteProps> = (props): JSX.Element => {

    console.debug("PCF FluentUI AutoComplete - FluentUIAutoComplete Start")
    console.debug("PCF FluentUI AutoComplete - props.context.parameters.value: ", props.value)


    // For focusZone dropdown
    const [focusWidth, setFocusWidth] = useState<number>(0);
    const getInputWidth = () => {
        let w = searchboxRef?.current?.offsetWidth
        if (typeof w == 'number') {
            w = w - 2
            if (focusWidth != w) {
                console.debug(`PCF FluentUI AutoComplete - getInputWidth w:${w}`)
                setFocusWidth(w)
            }
        }
    }

    // Section - Components for Search Function
    // NB I have probably over complicated this, but the idea was to introduce a debounce 
    // function to handel keyup and limit api calls to 500ms
    const [value, setValue] = useState<string>(props.value || "");
    const [selected, setSelected] = useState<boolean>(true);
    const [suggestions, setSuggestions] = useState([])
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const searchboxRef = useRef<HTMLDivElement>(null);
    const debouncedValue = useDebounce<string>(value, 500);

    const handelSearch = (evt: ChangeEvent<HTMLInputElement> | undefined) => {
        console.debug("PCF FluentUI AutoComplete - handelSearch value:", evt?.target.value)
        if (evt != undefined) {
            setIsLoading(true)
            setSelected(false)
            setValue(evt.target.value)
        }
    }

    useEffect(() => {

        console.debug("PCF FluentUI AutoComplete - useEffect")

        async function fetchSuggestions() {

            let uri = `https://api.business.govt.nz/gateway/nzbn/v5/entities?page-size=35&search-term=${encodeURI(debouncedValue.toLocaleLowerCase())}`

            console.debug("PCF FluentUI AutoComplete - fetchSuggestions searching")

            const response = await axios.get(uri, {
                headers: {
                    'Ocp-Apim-Subscription-Key': `${props.apiToken}`,
                    'Cache-Control': 'no-cache',
                }
            })

            if (response.status == 200) {
                console.debug("PCF FluentUI AutoComplete - fetchSuggestions response: ", response.data.items)
                setSuggestions(response.data.items)
                setIsLoading(false)
            }
        }

        // Check that value is greater than 2 char before calling the api and does not match current value
        if (selected == false && debouncedValue.length > 2) {
            fetchSuggestions()
        }
        else {
            setSuggestions([])
            setIsLoading(false)
        }
        // Check that containter has not changes size.
        getInputWidth()

    }, [debouncedValue, isLoading])

    const onClear = () => {
        console.debug("PCF FluentUI AutoComplete - getClear")
        setValue("")
        setSuggestions([])

        // Update the value in the parent component
        props.updateValue("")
    }

    const onSelect = (item: any) => {
        if (item != "" && item != undefined) {
            console.debug("PCF FluentUI AutoComplete - getSelect")
            setSelected(true)
            setValue(item.entityName)
            getDetail(item.nzbn) // Get and Set full details of the NZBN entity
        }
    }

    const openWebsite = (url: string) => {
        window.open(url, "_blank")
    }

    const spinner = (): JSX.Element => {
        return (
            <div className={style.focusZoneHeaderContent}>
                <Spinner
                    size={SpinnerSize.large}
                    labelPosition="left"
                    label="Waiting on results..." />
            </div>
        )
    }

    const renderDropdown = (item: any, index: number): JSX.Element => {

        const url = `https://www.nzbn.govt.nz/mynzbn/nzbndetails/${item.nzbn}`
        return (
            <div
                id={`suggestion_${index}`}
                key={`key_${index}`}
                className={style.itemContainer}
                data-is-focusable={true}
                onClick={() => onSelect(item)}
            >
                {/* Item Content for FocusZone  */}
                <div className={style.itemContent}>
                    <div className={style.itemHeader}>{item.entityName}</div>
                    <div className={style.itemDetail}>{`NZBN#  ${item.nzbn} `}</div>
                    <div className={style.itemDetail}>{`Status: ${item.entityStatusDescription} Registered: ${(moment(item.registrationDate)).format('DD/MMM/YYYY')}`}</div>

                    {item.tradingNames?.length > 0 &&
                        <div className={style.itemSection}>{`Trading Names`}</div>
                    }

                    {item.tradingNames?.length > 0 &&
                        item.tradingNames.map((tradingName: any) =>
                            <div className={style.itemDetail}>{` - ${tradingName.name}`}</div>
                        )}
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
                    >
                    </Icon>
                </TooltipHost>
                {/* End of Section */}
            </div >
        )
    }

    // ------------ API Call to get details of selected item
    const getDetail = (nzbn: string) => {

        // Get entity detail form the api.business.govt.nz service, and return the results. 
        // this could be any api end point so change the below at reqired.

        let uri = `https://api.business.govt.nz/gateway/nzbn/v5/entities/${nzbn}`

        console.debug("PCF FluentUI AutoComplete - getDetail")

        axios.get(uri, {
            headers: {
                'Ocp-Apim-Subscription-Key': `${props.apiToken}`,
                'Cache-Control': 'no-cache',
            }
        }).then(
            (response) => {

                setSuggestions([])

                // Update the value in the parent component
                props.updateValue(response.data)


            }
        ).catch(err => {
            console.error(err.message);
        }
        )
    }

    return (
        <div>
            <div ref={searchboxRef}>
                <ThemeProvider>
                    <Stack
                        tokens={stackTokens}
                        className={style.stackContainer}
                    >
                        <SearchBox
                            placeholder="---"
                            value={value}
                            onChange={handelSearch}
                            iconProps={searchIcon}
                            onClear={onClear}
                            disabled={props.isDisabled}
                            className={style.searchBox}
                        ></SearchBox>
                    </Stack>
                </ThemeProvider >
            </div>


            {/* FocusZone Section/Dropdown */}



            {suggestions.length > 0 &&

                <FocusZone
                    direction={FocusZoneDirection.vertical}
                    className={style.focusZoneContainer}
                    style={{ "width": focusWidth }}>

                    {/* Header Section of Focus Zone */}
                    <div className={style.focusZoneHeader}>

                        {!isLoading &&
                            <div className={style.focusZoneHeaderContent}>
                                <Label>Search Results</Label>
                            </div>
                        }

                        {isLoading && spinner()}

                    </div>
                    {/* End of Section  */}

                    {/* Suggestions Section of Focus Zone */}
                    <div
                        className={style.focusZoneContent}
                        data-is-scrollable>

                        {!isLoading && suggestions.map((suggestion, i) =>
                            renderDropdown(suggestion, i)
                        )}

                    </div>
                    {/* End of Section  */}

                    {/* Footer Section of Focus Zone */}
                    <div className={style.focusZoneFooter}>
                        <div className={style.focusZoneFooterLeft}>

                            {/* You can change the below iconProps, href, and text to what ever applies for your purposes or comment this section 
                            out completly if you do not wish to have footer buttons.*/}

                            <ActionButton
                                className={style.focusZoneBtn}
                                iconProps={dropBtnOne}
                                href={`https://www.nzbn.govt.nz/mynzbn/search/${encodeURI(value)}/`} target="_blank">
                                NZBN Website</ActionButton>
                        </div>

                        <div className={style.focusZoneFooterRight}>
                            <ActionButton
                                className={style.focusZoneBtn}
                                iconProps={dropBtnTwo}
                                href={`https://app.companiesoffice.govt.nz/companies/app/ui/pages/companies/search?q=${encodeURI(value)}&entityTypes=ALL&entityStatusGroups=ALL&incorpFrom=&incorpTo=&addressTypes=ALL&addressKeyword=&start=0&limit=15&sf=&sd=&advancedPanel=false&mode=standard#results`} target="_blank">
                                Companies Website</ActionButton>
                        </div>
                        {/* End of Section */}
                    </div>
                    {/* End of Section  */}
                </FocusZone>
            }
        </div>
    );
}
