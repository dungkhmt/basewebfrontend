export function buildMapPathMenu(menuConfig) {
  let listMenu=[];
  for(let i=0;i<menuConfig.length;i++){
    listMenu.push(...buildFromItem(menuConfig[i]));
  }
  let map= new Map();
  for(let i=0;i<listMenu.length;i++){
    let menu=listMenu[i];
    map.set(menu.path,menu);
  }
  return map;

}

function buildFromItem(config) {
  let ret = [];
  if (config.path !== "" && config.path !== undefined && config.path !== null) {
    ret.push(config);
  }
  if (
    config.child !== null &&
    config.child !== undefined &&
    config.child.length > 0
  ) {
    let parent = Object.assign({}, config);
    parent["child"]=null;
    let childs = config.child;
    for (let i = 0; i < childs.length; i++) {
      let menu = childs[i];
      menu["parent"] = parent;

      ret.push(...buildFromItem(menu));
    }
  }

  return ret;
}
