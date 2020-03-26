import IPerson from "./IPerson";
import IPhone from "./IPhone";
import IAddress from "./IAddress";

export default interface IPersonResponse {
    person?: IPerson,
    phones?: Array<IPhone>,
    addresses?: Array<IAddress>,
}