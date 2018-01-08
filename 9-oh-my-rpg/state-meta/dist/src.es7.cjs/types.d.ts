interface State {
    schema_version: number;
    revision: number;
    uuid: string;
    name: string;
    email: string | null;
    allow_telemetry: boolean;
}
export { State };
