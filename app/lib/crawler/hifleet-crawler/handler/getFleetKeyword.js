export default function getFleetKeyword(fleet) {
  const {
    name, mmsi, callsign, imo,
  } = fleet;

  if (mmsi && mmsi !== '-' && mmsi !== '') { return { selectorName: '#shipinfo_mmsi', keyword: mmsi }; }
  if (imo && imo !== '-' && imo !== '') { return { selectorName: '#shipinfo_imo', keyword: imo }; }
  if (callsign && callsign !== '-' && imo !== '') { return { selectorName: '#shipinfo_callsign', keyword: callsign }; }
  return { selectorName: '#shipWidgetName', keyword: name };
}
