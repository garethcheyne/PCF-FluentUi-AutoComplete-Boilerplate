// TypeScript interfaces for NZBN Entity Detail API Response

export interface Address {
    uniqueIdentifier: string;
    startDate: string;
    endDate: string | null;
    careOf: string | null;
    address1: string;
    address2: string | null;
    address3: string | null;
    address4: string | null;
    postCode: string;
    countryCode: string;
    addressType: string | null;
    pafId: string;
}

export interface AddressList {
    links: any[];
    addressList: Address[];
}

export interface IndustryClassification {
    uniqueIdentifier: string;
    classificationCode: string;
    classificationDescription: string;
}

export interface TradingNameDetail {
    uniqueIdentifier: string;
    name: string;
    startDate: string;
    endDate: string | null;
}

export interface PrivacySettings {
    namePrivateInformation: string | null;
    tradingNamePrivateInformation: string | null;
    businessClassificationPrivateInformation: string | null;
    phonePrivateInformation: string | null;
    emailPrivateInformation: string | null;
    partnersPrivateInformation: string | null;
    trusteesPrivateInformation: string | null;
    publicSuggestChangesYn: string | null;
    abnPrivateInformation: string | null;
    gstNumberPrivateInformation: string | null;
    paymentBankAccountNumbersPrivateInformation: string | null;
    registeredAddressPrivateInformation: string | null;
    postalAddressPrivateInformation: string | null;
    serviceAddressPrivateInformation: string | null;
    invoiceAddressPrivateInformation: string | null;
    deliveryAddressPrivateInformation: string | null;
    officeAddressPrivateInformation: string | null;
    businessEthnicityPrivateInformation: string | null;
}

export interface IndividualShareholder {
    firstName: string;
    middleNames: string;
    lastName: string;
    fullName: string;
}

export interface Shareholder {
    type: string;
    appointmentDate: string;
    vacationDate: string | null;
    individualShareholder: IndividualShareholder | null;
    otherShareholder: any | null;
    shareholderAddress: Address;
}

export interface ShareAllocation {
    allocation: number;
    shareholder: Shareholder[];
}

export interface Shareholding {
    numberOfShares: number;
    shareAllocation: ShareAllocation[];
    historicShareholder: any[];
}

export interface UltimateHoldingCompany {
    yn: boolean;
    name: string | null;
    type: string | null;
    number: string | null;
    nzbn: string | null;
    country: string | null;
    effectiveDate: string | null;
    ultimateHoldingCompanyAddress: any[];
}

export interface CompanyDetails {
    annualReturnFilingMonth: number;
    financialReportFilingMonth: number | null;
    nzsxCode: string | null;
    annualReturnLastFiled: string;
    hasConstitutionFiled: boolean;
    countryOfOrigin: string;
    overseasCompany: string;
    extensiveShareholding: boolean;
    stockExchangeListed: string | null;
    shareholding: Shareholding;
    ultimateHoldingCompany: UltimateHoldingCompany;
    australianCompanyNumber: string | null;
    insolvencies: any[];
    removalCommenced: boolean;
}

export interface RolePerson {
    title: string | null;
    firstName: string;
    middleNames: string;
    lastName: string;
}

export interface Role {
    roleType: string;
    roleStatus: string;
    startDate: string;
    endDate: string | null;
    asicDirectorshipYn: boolean;
    asicName: string | null;
    acn: string | null;
    roleEntity: any | null;
    rolePerson: RolePerson;
    roleAddress: Address[];
    roleAsicAddress: any | null;
    uniqueIdentifier: string;
}

export interface EntityDetailResponse {
    entityStatusCode: string;
    entityName: string;
    nzbn: string;
    entityTypeCode: string;
    entityTypeDescription: string;
    entityStatusDescription: string;
    registrationDate: string;
    sourceRegister: string;
    sourceRegisterUniqueIdentifier: string;
    lastUpdatedDate: string;
    australianBusinessNumber: string;
    emailAddresses: string[];
    addresses: AddressList;
    industryClassifications: IndustryClassification[];
    phoneNumbers: any[];
    websites: any[];
    tradingNames: TradingNameDetail[];
    privacySettings: PrivacySettings;
    "company-details": CompanyDetails | null;
    "non-company-details": any | null;
    roles: Role[];
    tradingAreas: any[];
    paymentBankAccounts: any | null;
    gstNumbers: any[];
    "supporting-information": any | null;
    hibernationStatusCode: string | null;
    hibernationStatusDescription: string | null;
    businessEthnicityIdentifiers: any[];
}

// Helper type for accessing addresses more easily
export interface FormattedAddress {
    type: string;
    fullAddress: string;
    address1: string;
    address2?: string;
    suburb?: string;
    city?: string;
    postcode?: string;
    country: string;
}

// Utility functions for working with the entity data
export class EntityDetailUtils {
    static formatAddress(address: Address): FormattedAddress {
        const parts = [
            address.address1,
            address.address2,
            address.address3,
        ].filter(Boolean);
        
        return {
            type: address.addressType || 'Unknown',
            fullAddress: `${parts.join(', ')}${address.postCode ? ` ${address.postCode}` : ''}`,
            address1: address.address1,
            address2: address.address2 || undefined,
            suburb: address.address2 || undefined,
            city: address.address3 || undefined,
            postcode: address.postCode,
            country: address.countryCode,
        };
    }

    static getActiveDirectors(entity: EntityDetailResponse): Role[] {
        return entity.roles.filter(role => 
            role.roleType === 'Director' && 
            role.roleStatus === 'ACTIVE'
        );
    }

    static getActiveTradingNames(entity: EntityDetailResponse): TradingNameDetail[] {
        return entity.tradingNames.filter(name => !name.endDate);
    }

    static getFormattedAddresses(entity: EntityDetailResponse): FormattedAddress[] {
        return entity.addresses.addressList.map(this.formatAddress);
    }
}
