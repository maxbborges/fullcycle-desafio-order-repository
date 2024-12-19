import IEvent from "../event.interface";

export default class CustomerCreated1Event implements IEvent {
  dataTimeOccurred: Date;
  eventData: any;

  constructor(eventData: any) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
  }
}