const fs = require('fs');

const slabs = [
    slab("stone"),
    slab("cobblestone"),
    slab("mossy_cobblestone"),
    slab("smooth_stone", null, "none"),
    slab("mossy_stone_bricks"),
    slab("granite"),
    slab("polished_granite"),
    slab("diorite"),
    slab("polished_diorite"),
    slab("andesite"),
    slab("polished_andesite"),
    slab("polished_deepslate"),
    slab("deepslate_bricks"),
    slab("deepslate_tiles"),
    slab("polished_tuff"),
    slab("bricks"),
    slab("mud_bricks"),
    slab("smooth_sandstone"),
    slab("cut_sandstone", null, "none"),
    slab("smooth_red_sandstone"),
    slab("cut_red_sandstone", null, "none"),
    slab("prismarine"),
    slab("prismarine_bricks"),
    slab("dark_prismarine"),
    slab("red_nether_bricks"),
    slab("blackstone"),
    slab("polished_blackstone_bricks"),
    slab("end_stone_bricks"),
    slab("purpur_block"),
    slab("smooth_quartz"),
    slab("bamboo_mosaic"),
    slab("oak_planks"),
    slab("spruce_planks"),
    slab("birch_planks"),
    slab("jungle_planks"),
    slab("acacia_planks"),
    slab("dark_oak_planks"),
    slab("mangrove_planks"),
    slab("cherry_planks"),
    slab("pale_oak_planks"),
    slab("crimson_planks"),
    slab("warped_planks")
];

const chisel_slabs = [
    slab("stone_bricks"),
    slab("cobbled_deepslate"),
    slab("tuff"),
    slab("tuff_bricks"),
    slab("resin_bricks"),
    slab("sandstone"),
    slab("red_sandstone"),
    slab("nether_bricks"),
    slab("polished_blackstone"),
    slab("quartz_block"),
    slab("bamboo_planks", "bamboo_slab", "bamboo_stairs"),
    slab("cut_copper"),
    slab("exposed_cut_copper"),
    slab("weathered_cut_copper"),
    slab("oxidized_cut_copper"),
    slab("waxed_cut_copper"),
    slab("waxed_exposed_cut_copper"),
    slab("waxed_weathered_cut_copper"),
    slab("waxed_oxidized_cut_copper"),
]

function slab(block_name, slab_name, stair_name) {
    if(!slab_name || !stair_name) {
        let root_name = block_name;
        if(block_name.endsWith('_planks')) {
            const idx = '_planks'.length;
            root_name = block_name.slice(0, block_name.length - idx);
        } else if(block_name.endsWith('s')) {
            root_name = block_name.slice(0, block_name.length - 1);
        } else if(block_name.endsWith('_block')) {
            const idx = '_block'.length;
            root_name = block_name.slice(0, block_name.length - idx);
        }

        if(!slab_name)
            slab_name = root_name + '_slab';
        if(!stair_name)
            stair_name = root_name + '_stairs';
    }

    return { 
        slab_id: `minecraft:${slab_name}`,
        block_id: `minecraft:${block_name}`,
        stair_id: `minecraft:${stair_name}`
    }
}

function slab_recipe(slab_data, group) {
    return {
        type: "minecraft:crafting_shaped",
        group: group,
        pattern: [
            "s",
            "s"
        ],
        key: {
            "s": slab_data.slab_id
        },
        result: {
            id: slab_data.block_id,
        }
    };
}

function quad_slab_recipe(slab_data, group) {
    return {
        type: "minecraft:crafting_shaped",
        group: group,
        pattern: [
            "ss",
            "ss"
        ],
        key: {
            "s": slab_data.slab_id
        },
        result: {
            id: slab_data.block_id,
            count: 2
        }
    };
}

function stair_recipe(slab_data, group) {
    return {
        type: "minecraft:crafting_shapeless",
        group: group,
        ingredients: [
            slab_data.stair_id
        ],
        result: {
            id: slab_data.block_id
        }
    };
}

function str(obj) {
    return JSON.stringify(obj, null, 4);
}

function write_slab(overwrite, slab_data, chisel = false, res_prefix) {
    let mode = overwrite ? 'w' : 'wx';
    const slab_folder = 'Survival Tweaks/data/survivaltweaks/recipe/slabs';
    const stair_folder = 'Survival Tweaks/data/survivaltweaks/recipe/stairs';
    let resource_id = slab_data.block_id.split(':')[1];

    let slab_r = chisel ? quad_slab_recipe(slab_data, resource_id) : slab_recipe(slab_data, resource_id);
    let stair_r = stair_recipe(slab_data, resource_id);
    
    if(res_prefix) {
        resource_id = `${res_prefix}/${resource_id}`;
    }

    let slab_file = `${slab_folder}/${resource_id}.json`;
    let stair_file = `${stair_folder}/${resource_id}.json`;

    if(slab_data.slab_id != "minecraft:none") {
        try {
            fs.writeFileSync(slab_file, str(slab_r), {flag: mode});
        } catch(e) {
            console.error(`slabs/${resource_id} already exists`);
        }
    }

    if(slab_data.stair_id != "minecraft:none") {
        try {
            fs.writeFileSync(stair_file, str(stair_r), {flag: mode})
        } catch(e) {
            console.error(`stairs/${resource_id} already exists`);
        }
    }
}

function main(overwrite = false) {
    for(let slab_data of slabs) {
        if(slab_data.block_id.endsWith('_planks')) {
            write_slab(overwrite, slab_data, false, 'wood');
        } else {
            write_slab(overwrite, slab_data);
        }
    }

    for(let slab_data of chisel_slabs) {
        write_slab(overwrite, slab_data, true);
    }
}

main(process.argv[2] == "true");
